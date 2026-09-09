const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Safe favicon replacements
html = html.replace(/images\/cropped-logo-imprenta-mf-32x32\.png/g, 'images/logo_roni.png');
html = html.replace(/images\/cropped-logo-imprenta-mf-192x192\.png/g, 'images/logo_roni.png');
html = html.replace(/images\/cropped-logo-imprenta-mf-180x180\.png/g, 'images/logo_roni.png');
html = html.replace(/https:\/\/imprentamf\.com\/wp-content\/uploads\/2022\/02\/cropped-logo-imprenta-mf-270x270\.png/g, 'images/logo_roni.png');

// Safe WhatsApp replacement for index.html ONLY (target exact wa.link)
html = html.replace(/https:\/\/wa\.link\/b6gyc4/g, 'https://wa.me/51991104943?text=Hola%20Imprenta%20Roni,%20deseo%20asesor%C3%ADa');

fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html safely updated');
