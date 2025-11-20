import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const language = searchParams.get('language') || 'en';
    const level = searchParams.get('level');
    const published = searchParams.get('published') !== 'false';

    const where: any = { published };
    if (level) where.level = level;

    const courses = await prisma.course.findMany({
      where,
      include: {
        instructor: {
          include: {
            user: {
              select: { name: true, email: true },
            },
          },
        },
        _count: {
          select: { enrollments: true, modules: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Fetch courses error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    const userRole = req.headers.get('x-user-role');

    if (userRole !== 'INSTRUCTOR' && userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const instructor = await prisma.instructor.findUnique({
      where: { userId: userId! },
    });

    if (!instructor) {
      return NextResponse.json(
        { error: 'Instructor profile not found' },
        { status: 404 }
      );
    }

    const body = await req.json();
    const {
      title,
      titleAr,
      description,
      descriptionAr,
      level,
      language,
      duration,
      price,
      tags,
    } = body;

    const course = await prisma.course.create({
      data: {
        title,
        titleAr,
        description,
        descriptionAr,
        level,
        language,
        duration: parseInt(duration),
        price: parseFloat(price) || 0,
        tags: tags || [],
        instructorId: instructor.id,
      },
    });

    return NextResponse.json({ course });
  } catch (error) {
    console.error('Create course error:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}
