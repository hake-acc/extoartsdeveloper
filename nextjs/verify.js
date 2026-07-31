const fs = require('fs');
const content = fs.readFileSync('src/app/globals.css', 'utf8');
const count = (content.match(/feComposite in2%3D/g) || []).length;
console.log('feComposite occurrences:', count);

// Decode one SVG to verify
const lines = content.split('\n');
for (const line of lines) {
  if (line.includes('btn-main') && line.includes('background-image')) {
    const svgMatch = line.match(/url\("(data:image\/svg\+xml,[^"]+)"\)/);
    if (svgMatch) {
      const decoded = decodeURIComponent(svgMatch[1].replace('data:image/svg+xml,', ''));
      const fi = decoded.indexOf('<filter');
      const fe = decoded.indexOf('</filter>') + 9;
      console.log('\nFilter section of .btn-main SVG:');
      console.log(decoded.substring(fi, fe));
      break;
    }
  }
}
