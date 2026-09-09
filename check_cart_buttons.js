const fs = require('fs');
const html = fs.readFileSync('cajas-y-empaques.html', 'utf8');
const regex = /class="[^"]*cart[^"]*"/g;
let match;
while((match = regex.exec(html)) !== null) {
    console.log(match[0]);
}
