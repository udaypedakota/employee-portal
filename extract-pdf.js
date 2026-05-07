const pdfParse = require('pdf-parse/lib/pdf-parse.js');
const fs = require('fs');

async function extract(file) {
  const buf = fs.readFileSync(file);
  const data = await pdfParse(buf);
  console.log('=== ' + file + ' ===');
  console.log(data.text);
}

extract('Holiday List-2025.pdf').then(() => extract('Holiday_List_2026.pdf'));
