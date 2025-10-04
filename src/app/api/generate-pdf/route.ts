// import { NextApiRequest, NextApiResponse } from 'next';
// import puppeteer from 'puppeteer';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   const { html, options = {} } = req.body;

//   if (!html) {
//     return res.status(400).json({ error: 'HTML content is required' });
//   }

//   try {
//     const browser = await puppeteer.launch({
//       headless: true,
//       args: ['--no-sandbox', '--disable-setuid-sandbox']
//     });

//     const page = await browser.newPage();
    
//     // Set the HTML content
//     await page.setContent(html, {
//       waitUntil: 'networkidle0'
//     });

//     // Generate PDF
//     const pdf = await page.pdf({
//       format: 'A4',
//       printBackground: true,
//       margin: {
//         top: '20mm',
//         right: '20mm',
//         bottom: '20mm',
//         left: '20mm'
//       },
//       ...options
//     });

//     await browser.close();

//     // Set headers for PDF download
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', 'attachment; filename=quotation.pdf');
//     res.send(pdf);

//   } catch (error) {
//     console.error('PDF generation error:', error);
//     res.status(500).json({ error: 'Failed to generate PDF' });
//   }
// }