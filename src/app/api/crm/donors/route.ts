import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const userRole = req.headers.get('x-user-role');

    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const donors = await prisma.donor.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        donations: {
          where: { status: 'COMPLETED' },
          select: {
            amount: true,
            createdAt: true,
          },
        },
        _count: {
          select: { donations: true },
        },
      },
      orderBy: { totalDonated: 'desc' },
    });

    return NextResponse.json({ donors });
  } catch (error) {
    console.error('Fetch donors error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch donors' },
      { status: 500 }
    );
  }
}
