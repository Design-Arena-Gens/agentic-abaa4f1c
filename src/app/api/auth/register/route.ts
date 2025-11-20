import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, generateToken } from '@/lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  role: z.enum(['STUDENT', 'INSTRUCTOR', 'DONOR', 'EMPLOYER']).default('STUDENT'),
  language: z.enum(['en', 'ar']).default('en'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, role, language } = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        language,
      },
    });

    // Create role-specific profile
    if (role === 'STUDENT') {
      await prisma.student.create({
        data: { userId: user.id },
      });
    } else if (role === 'INSTRUCTOR') {
      await prisma.instructor.create({
        data: { userId: user.id },
      });
    } else if (role === 'DONOR') {
      await prisma.donor.create({
        data: { userId: user.id },
      });
    } else if (role === 'EMPLOYER') {
      await prisma.employer.create({
        data: {
          userId: user.id,
          company: 'Not specified',
        },
      });
    }

    const token = generateToken(user.id, user.role);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
