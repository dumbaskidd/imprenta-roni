const fs = require('fs');
const { execSync } = require('child_process');

let html = fs.readFileSync('js/cart_system.js', 'utf8');
if (!html.includes('form.cart')) {
    html += '\ndocument.addEventListener("submit", function(e) { if(e.target.closest("form.cart")) { e.preventDefault(); e.stopPropagation(); } }, true);';
    fs.writeFileSync('js/cart_system.js', html, 'utf8');
}

const files = execSync('git ls-tree -r main --name-only').toString().split('\n').filter(f => f.endsWith('.html'));
for (const f of files) {
    try {
        let content = fs.readFileSync(f, 'utf8');
        if (content.includes('cart_system.js')) {
            content = content.replace(/cart_system\.js(\?v=\d+)?/g, 'cart_system.js?v=' + Date.now());
            fs.writeFileSync(f, content, 'utf8');
        }
    } catch(e) {}
}
