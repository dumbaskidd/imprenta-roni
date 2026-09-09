const fs = require('fs');
const path = require('path');

// Fix contactanos.html - add mailto form handler and cart_system.js
const contactPath = path.join(__dirname, 'contactanos.html');
let html = fs.readFileSync(contactPath, 'utf-8');

// Add a script that intercepts the contact form and redirects to mailto
const formScript = `
<script>
document.addEventListener('DOMContentLoaded', function() {
    // Intercept the contact form submission
    const forms = document.querySelectorAll('.wpcf7-form, form[action*="wp-json"]');
    forms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const nameInput = form.querySelector('input[name="your-name"]');
            const emailInput = form.querySelector('input[name="your-email"]');
            const phoneInput = form.querySelector('input[name="your-phone"]');
            const messageInput = form.querySelector('textarea[name="your-message"]');
            
            const name = nameInput ? nameInput.value : '';
            const email = emailInput ? emailInput.value : '';
            const phone = phoneInput ? phoneInput.value : '';
            const message = messageInput ? messageInput.value : '';
            
            const subject = encodeURIComponent('Consulta de ' + name + ' - Imprenta Roni');
            const body = encodeURIComponent(
                'Nombre: ' + name + '\\n' +
                'Email: ' + email + '\\n' +
                'Teléfono: ' + phone + '\\n\\n' +
                'Mensaje:\\n' + message
            );
            
            window.location.href = 'mailto:weare@imprentaroni.shop?subject=' + subject + '&body=' + body;
        });
    });
});
</script>
`;

// Add before </body>
html = html.replace('</body>', formScript + '<script src="js/cart_system.js"></script></body>');

fs.writeFileSync(contactPath, html, 'utf-8');
console.log('Fixed contactanos.html with mailto form and cart_system.js');
