import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    const body = await req.json();
    const { amount, currency = 'USD', purpose } = body;

    const donor = await prisma.donor.findUnique({
      where: { userId: userId! },
    });

    if (!donor) {
      return NextResponse.json(
        { error: 'Donor profile not found' },
        { status: 404 }
      );
    }

    const donation = await prisma.donation.create({
      data: {
        donorId: donor.id,
        amount: parseFloat(amount),
        currency,
        purpose,
        status: 'COMPLETED', // In production, integrate payment gateway
        processedAt: new Date(),
      },
    });

    await prisma.donor.update({
      where: { id: donor.id },
      data: {
        totalDonated: {
          increment: parseFloat(amount),
        },
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: userId!,
        action: 'DONATION_MADE',
        entity: 'Donation',
        entityId: donation.id,
        metadata: { amount, currency, purpose },
      },
    });

    return NextResponse.json({ donation });
  } catch (error) {
    console.error('Donation error:', error);
    return NextResponse.json(
      { error: 'Failed to process donation' },
      { status: 500 }
    );
  }
}
