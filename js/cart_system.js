document.addEventListener('DOMContentLoaded', function() {
    const CACHE_KEY = 'roni_cart';
    
    function getCart() {
        return JSON.parse(localStorage.getItem(CACHE_KEY) || '[]');
    }
    
    function saveCart(cart) {
        localStorage.setItem(CACHE_KEY, JSON.stringify(cart));
        updateCartUI();
    }
    
    function addToCart(product) {
        const cart = getCart();
        const existing = cart.find(p => p.name === product.name);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...product, qty: 1 });
        }
        saveCart(cart);
        
        // Show success animation or alert
        const btn = document.querySelector('.wd-header-cart');
        if (btn) {
            btn.style.transform = 'scale(1.2)';
            setTimeout(() => btn.style.transform = 'scale(1)', 200);
        }
    }
    
    // Capture-phase listener to intercept add to cart BEFORE WooCommerce
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('.add_to_cart_button, .single_add_to_cart_button, .wd-add-btn a');
        if (btn) {
            // STOP WooCommerce from seeing this click
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
            
            // Remove woocommerce loading classes if they got added
            btn.classList.remove('loading');
            
            let productName = btn.getAttribute('aria-label') || btn.getAttribute('data-product_title') || '';
            let priceText = '0';
            
            const productBlock = btn.closest('.product');
            if (productBlock) {
                if (!productName) {
                    const titleEl = productBlock.querySelector('.woocommerce-loop-product__title, .product_title');
                    if (titleEl) productName = titleEl.textContent.trim();
                }
                const priceEl = productBlock.querySelector('.price .amount bdi, .price .amount');
                if (priceEl) {
                    priceText = priceEl.textContent.replace(/[^0-9.]/g, '');
                }
            }
            
            const price = parseFloat(priceText) || 0;
            addToCart({ name: productName || 'Producto Seleccionado', price: price });
            openCartModal(); // Auto open cart on add
        }
    }, true); // Use capture phase!

    // Capture-phase listener for cart icons
    document.addEventListener('click', function(e) {
        const link = e.target.closest('.wd-header-cart a, a[href*="carrito"], a[href*="cart"]');
        if (link && !e.target.closest('#roni-cart-modal')) {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
            openCartModal();
        }
    }, true);
    
    // Update badge and total
    function updateCartUI() {
        const cart = getCart();
        const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
        const totalPrice = cart.reduce((acc, item) => acc + (item.qty * item.price), 0);
        
        document.querySelectorAll('.wd-cart-number').forEach(el => {
            el.innerHTML = totalItems + ' <span>items</span>';
        });
        document.querySelectorAll('.wd-cart-subtotal .amount').forEach(el => {
            el.innerHTML = 'S/' + totalPrice.toFixed(2);
        });
        
        // Update modal if open
        renderCartModalItems();
    }
    
    // Modal logic
    function openCartModal() {
        let modal = document.getElementById('roni-cart-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'roni-cart-modal';
            modal.style.cssText = 'position:fixed;top:0;right:0;width:350px;max-width:100%;height:100vh;background:#fff;box-shadow:-5px 0 15px rgba(0,0,0,0.2);z-index:999999;padding:20px;display:flex;flex-direction:column;transform:translateX(100%);transition:transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);font-family:sans-serif;';
            
            const header = document.createElement('div');
            header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #eee;padding-bottom:15px;margin-bottom:15px;';
            
            const title = document.createElement('h3');
            title.textContent = 'Tu Carrito';
            title.style.margin = '0';
            
            const closeBtn = document.createElement('button');
            closeBtn.innerHTML = '&times;';
            closeBtn.style.cssText = 'border:none;background:none;font-size:28px;cursor:pointer;color:#333;line-height:1;';
            closeBtn.onclick = () => { modal.style.transform = 'translateX(100%)'; };
            
            header.append(title, closeBtn);
            
            const itemsContainer = document.createElement('div');
            itemsContainer.id = 'roni-cart-items';
            itemsContainer.style.cssText = 'flex:1;overflow-y:auto;margin-bottom:20px;';
            
            const messageArea = document.createElement('textarea');
            messageArea.id = 'roni-cart-message';
            messageArea.placeholder = 'Mensaje adicional o duda sobre tu pedido...';
            messageArea.style.cssText = 'width:100%;height:80px;margin-bottom:15px;padding:10px;border:1px solid #ddd;border-radius:5px;resize:none;font-family:inherit;';
            
            const totalEl = document.createElement('h3');
            totalEl.id = 'roni-cart-total';
            totalEl.style.cssText = 'text-align:right;margin-bottom:15px;color:#00a3d5;';
            
            const sendBtn = document.createElement('button');
            sendBtn.innerHTML = '<i class="fa-brands fa-whatsapp" style="margin-right:8px;font-size:20px;"></i> Enviar pedido por WhatsApp';
            sendBtn.style.cssText = 'width:100%;padding:15px;background:#25D366;color:#fff;border:none;border-radius:5px;font-weight:bold;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:16px; transition:background 0.2s;';
            sendBtn.onmouseover = () => sendBtn.style.background = '#1da851';
            sendBtn.onmouseout = () => sendBtn.style.background = '#25D366';
            sendBtn.onclick = checkoutWhatsApp;
            
            modal.append(header, itemsContainer, messageArea, totalEl, sendBtn);
            document.body.appendChild(modal);
        }
        
        renderCartModalItems();
        // Allow reflow before animating
        setTimeout(() => { modal.style.transform = 'translateX(0)'; }, 10);
    }
    
    function renderCartModalItems() {
        const container = document.getElementById('roni-cart-items');
        const totalEl = document.getElementById('roni-cart-total');
        if (!container) return;
        
        const cart = getCart();
        container.innerHTML = '';
        let total = 0;
        
        if (cart.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:#888;margin-top:40px;">Tu carrito está vacío.</p>';
        } else {
            cart.forEach((item, index) => {
                total += item.price * item.qty;
                const div = document.createElement('div');
                div.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:15px;padding-bottom:15px;border-bottom:1px solid #eee;';
                div.innerHTML = `
                    <div style="flex:1;padding-right:10px;">
                        <div style="font-weight:bold;font-size:14px;margin-bottom:5px;line-height:1.2;">${item.name}</div>
                        <div style="color:#666;font-size:13px;display:flex;align-items:center;gap:10px;">
                            <span style="background:#f5f5f5;padding:2px 8px;border-radius:10px;">Cant: ${item.qty}</span> 
                            <span style="font-weight:bold;color:#333;">S/${item.price.toFixed(2)}</span>
                        </div>
                    </div>
                    <button onclick="window.removeRoniCartItem(${index})" style="background:none;border:none;color:#ff4d4d;cursor:pointer;font-size:20px;padding:5px;" title="Eliminar">&times;</button>
                `;
                container.appendChild(div);
            });
        }
        totalEl.textContent = 'Total: S/' + total.toFixed(2);
    }
    
    window.removeRoniCartItem = function(index) {
        const cart = getCart();
        cart.splice(index, 1);
        saveCart(cart);
        renderCartModalItems();
    };
    
    function checkoutWhatsApp() {
        const cart = getCart();
        if (cart.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }
        
        let text = '*¡Hola Imprenta Roni! Deseo hacer el siguiente pedido:*%0A%0A';
        let total = 0;
        cart.forEach(item => {
            text += `- ${item.qty}x ${item.name} (S/${item.price.toFixed(2)})%0A`;
            total += item.qty * item.price;
        });
        
        text += `%0A*Total: S/${total.toFixed(2)}*%0A`;
        
        const msg = document.getElementById('roni-cart-message').value.trim();
        if (msg) {
            text += `%0A*Mensaje adicional / Asesoría:*%0A_${encodeURIComponent(msg)}_%0A`;
        }
        
        window.open('https://wa.me/51991104943?text=' + text, '_blank');
    }
    
    // Fix all generic WhatsApp buttons
    function fixWhatsAppButtons() {
        const waButtons = document.querySelectorAll('a[href*="wa.me"], a[href*="api.whatsapp.com"], a[href*="wa.link"]');
        waButtons.forEach(btn => {
            btn.href = 'https://wa.me/51991104943?text=Hola%20Imprenta%20Roni,%20deseo%20asesor%C3%ADa';
        });
    }

    // Capture-phase listener for ht-ctc plugin clicks
    document.addEventListener('click', function(e) {
        const ctc = e.target.closest('.ht-ctc-chat, .ht-ctc');
        if (ctc) {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();
            window.open('https://wa.me/51991104943?text=Hola%20Imprenta%20Roni,%20deseo%20asesor%C3%ADa', '_blank');
        }
    }, true);

    setTimeout(() => {
        fixWhatsAppButtons();
        updateCartUI();
    }, 500);
});

document.addEventListener("submit", function(e) { if(e.target.closest("form.cart")) { e.preventDefault(); e.stopPropagation(); } }, true);