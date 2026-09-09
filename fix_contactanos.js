const fs = require('fs');
const path = require('path');

const contactPath = path.join(__dirname, 'contactanos.html');
let html = fs.readFileSync(contactPath, 'utf-8');

// Replace the previous injected script with a capture-phase interceptor
const newScript = `
<script>
document.addEventListener('submit', function(e) {
    const form = e.target.closest('form');
    if (form && (form.classList.contains('wpcf7-form') || form.action.includes('wp-json'))) {
        e.preventDefault();
        e.stopImmediatePropagation();
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
    }
}, true); // CAPTURE PHASE!
</script>
`;

// We need to replace the old script if it exists.
// The old script started with <script> and ended with </script> and contained 'const forms = document.querySelectorAll('.wpcf7-form'
if (html.includes('const forms = document.querySelectorAll(\'.wpcf7-form')) {
    html = html.replace(/<script>[^<]*const forms = document\.querySelectorAll\('\.wpcf7-form[^<]*<\/script>/, newScript);
} else {
    // Just inject it if we didn't find the old one
    html = html.replace('</body>', newScript + '</body>');
}

fs.writeFileSync(contactPath, html, 'utf-8');
console.log('Fixed contactanos.html with capture-phase submit interceptor');
