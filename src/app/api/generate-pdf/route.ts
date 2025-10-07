import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";

// Fallback PDF generation: assemble a simple PDF. For full A4 capture, use client print or client-side html2canvas + jsPDF to send images here.
export async function POST(req: NextRequest) {
  try {
    const { title = "Quotation", notes = "" } = await req.json();
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    doc.setFontSize(18);
    doc.text(String(title), 40, 60);
    doc.setFontSize(12);
    doc.text('This PDF was generated on the server as a fallback.', 40, 90);
    if (notes) {
      const lines = doc.splitTextToSize(String(notes), 515);
      doc.text(lines, 40, 120);
    }
    const pdfBytes = doc.output('arraybuffer');
    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="quotation.pdf"'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Failed to generate PDF' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ success: true, message: "Generate PDF endpoint is reachable" });
}