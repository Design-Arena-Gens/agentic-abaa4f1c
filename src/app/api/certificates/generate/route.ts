import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { createHash } from 'crypto';
import QRCode from 'qrcode';

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    const body = await req.json();
    const { courseId } = body;

    const student = await prisma.student.findUnique({
      where: { userId: userId! },
      include: { user: true },
    });

    if (!student) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      );
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: student.id,
          courseId,
        },
      },
      include: {
        course: true,
      },
    });

    if (!enrollment || enrollment.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Course not completed' },
        { status: 400 }
      );
    }

    // Check if certificate already exists
    const existingCert = await prisma.certificate.findFirst({
      where: {
        studentId: student.id,
        courseId,
        status: 'ISSUED',
      },
    });

    if (existingCert) {
      return NextResponse.json(
        { certificate: existingCert },
        { status: 200 }
      );
    }

    // Generate certificate number
    const certNumber = `CERT-${Date.now()}-${student.id.substring(0, 8)}`;

    // Create verification hash
    const verificationData = `${certNumber}:${student.id}:${courseId}:${new Date().toISOString()}`;
    const verificationHash = createHash('sha256').update(verificationData).digest('hex');

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(
      `${process.env.NEXTAUTH_URL}/verify/${verificationHash}`
    );

    // Create PDF certificate
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]); // A4 landscape
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Header
    page.drawText('Certificate of Completion', {
      x: 250,
      y: 500,
      size: 32,
      font,
      color: rgb(0.1, 0.3, 0.6),
    });

    // Student name
    page.drawText(student.user.name || 'Student', {
      x: 300,
      y: 400,
      size: 24,
      font,
    });

    // Course title
    page.drawText(`Has successfully completed: ${enrollment.course.title}`, {
      x: 150,
      y: 350,
      size: 16,
      font: regularFont,
    });

    // Date
    page.drawText(`Date: ${new Date().toLocaleDateString()}`, {
      x: 350,
      y: 250,
      size: 14,
      font: regularFont,
    });

    // Certificate number
    page.drawText(`Certificate No: ${certNumber}`, {
      x: 300,
      y: 200,
      size: 12,
      font: regularFont,
    });

    // Verification hash
    page.drawText(`Verification: ${verificationHash.substring(0, 32)}...`, {
      x: 220,
      y: 150,
      size: 10,
      font: regularFont,
    });

    const pdfBytes = await pdfDoc.save();
    const pdfBase64 = Buffer.from(pdfBytes).toString('base64');

    // Save certificate to database
    const certificate = await prisma.certificate.create({
      data: {
        studentId: student.id,
        courseId,
        certificateNumber: certNumber,
        verificationHash,
        status: 'ISSUED',
      },
    });

    return NextResponse.json({
      certificate,
      pdf: `data:application/pdf;base64,${pdfBase64}`,
      qrCode: qrCodeUrl,
    });
  } catch (error) {
    console.error('Certificate generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate certificate' },
      { status: 500 }
    );
  }
}
