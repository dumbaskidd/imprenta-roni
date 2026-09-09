const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf-8');

// Find favicon references
const faviconRegex = /cropped-logo|rel=.icon.|favicon|apple-touch-icon|msapplication-TileImage/gi;
let match;
while ((match = faviconRegex.exec(c)) !== null) {
    console.log('Found at', match.index, ':', c.substring(Math.max(0, match.index - 50), match.index + 150));
    console.log('---');
}

// Also find contactanos links
const contactRegex = /contactanos|contáctanos/gi;
while ((match = contactRegex.exec(c)) !== null) {
    console.log('Contact link at', match.index, ':', c.substring(Math.max(0, match.index - 100), match.index + 200));
    console.log('---');
}

// Find wa.link references
const waRegex = /wa\.link/gi;
while ((match = waRegex.exec(c)) !== null) {
    console.log('wa.link at', match.index, ':', c.substring(Math.max(0, match.index - 50), match.index + 100));
    console.log('---');
}
