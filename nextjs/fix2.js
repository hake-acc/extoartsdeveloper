const fs = require('fs');
const file = 'src/app/globals.css';
let content = fs.readFileSync(file, 'utf8');

// Fix: the = signs in feComposite attributes were incorrectly encoded as %3D
// They need to be literal = signs inside the data URI string
const before = "%3CfeComposite in2%3D'SourceGraphic' operator%3D'in' /%3E";
const after  = "%3CfeComposite in2='SourceGraphic' operator='in' /%3E";

const count = content.split(before).length - 1;
content = content.split(before).join(after);
fs.writeFileSync(file, content);
console.log(`Fixed ${count} occurrences of incorrectly encoded feComposite`);
