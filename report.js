import PDFDocument from "pdfkit";
import fs from "fs";


// Create a new PDF document
const doc = new PDFDocument();

// Pipe the PDF into a writeable stream to save to a file
const stream = fs.createWriteStream('report.pdf');
doc.pipe(stream);

// Add content to the PDF
doc
  .fontSize(20)
  .text('Sample Report', { align: 'center' })
  .moveDown();

doc
  .fontSize(12)
  .text('This is a sample report generated using PDFKit in Node.js.');

// Finalize the PDF
doc.end();

console.log('Report generated successfully!');
