import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ hash: string }> }
) {
  try {
    const { hash } = await params;

    const certificate = await prisma.certificate.findUnique({
      where: { verificationHash: hash },
      include: {
        student: {
          include: { user: true },
        },
        course: true,
      },
    });

    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate not found', valid: false },
        { status: 404 }
      );
    }

    const isValid = certificate.status === 'ISSUED' &&
      (!certificate.expiresAt || certificate.expiresAt > new Date());

    return NextResponse.json({
      valid: isValid,
      certificate: {
        number: certificate.certificateNumber,
        studentName: certificate.student.user.name,
        courseName: certificate.course.title,
        issuedAt: certificate.issuedAt,
        status: certificate.status,
      },
    });
  } catch (error) {
    console.error('Certificate verification error:', error);
    return NextResponse.json(
      { error: 'Verification failed', valid: false },
      { status: 500 }
    );
  }
}
