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

    const [
      totalStudents,
      totalCourses,
      totalEnrollments,
      totalDonations,
      activeStudents,
      completedCourses,
      recentActivities,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.course.count({ where: { published: true } }),
      prisma.enrollment.count(),
      prisma.donation.aggregate({
        _sum: { amount: true },
        where: { status: 'COMPLETED' },
      }),
      prisma.student.count({
        where: {
          enrollments: {
            some: {
              status: 'ACTIVE',
            },
          },
        },
      }),
      prisma.enrollment.count({
        where: { status: 'COMPLETED' },
      }),
      prisma.activityLog.findMany({
        take: 20,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true, email: true },
          },
        },
      }),
    ]);

    const studentsByType = await prisma.student.groupBy({
      by: ['studentType'],
      _count: true,
    });

    const enrollmentsByMonth = await prisma.$queryRaw`
      SELECT
        DATE_TRUNC('month', "enrolledAt") as month,
        COUNT(*) as count
      FROM "Enrollment"
      WHERE "enrolledAt" > NOW() - INTERVAL '6 months'
      GROUP BY month
      ORDER BY month DESC
    `;

    return NextResponse.json({
      overview: {
        totalStudents,
        totalCourses,
        totalEnrollments,
        totalDonations: totalDonations._sum.amount || 0,
        activeStudents,
        completedCourses,
      },
      studentsByType,
      enrollmentsByMonth,
      recentActivities,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
