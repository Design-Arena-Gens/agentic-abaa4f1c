import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    const body = await req.json();
    const { prompt, context, language = 'en' } = body;

    const systemPrompt = language === 'ar'
      ? `أنت مدرس ذكي ومتعاون. ساعد الطلاب في فهم المواد التعليمية. كن صبورًا وواضحًا في شرحك.`
      : `You are an intelligent and helpful tutor. Help students understand educational materials. Be patient and clear in your explanations.`;

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system' as const, content: systemPrompt },
      ...(context ? [{ role: 'assistant' as const, content: `Context: ${context}` }] : []),
      { role: 'user' as const, content: prompt },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0]?.message?.content || 'No response';

    // Log AI interaction
    await prisma.aIInteraction.create({
      data: {
        userId: userId || undefined,
        prompt,
        response,
        model: 'gpt-4o-mini',
        tokens: completion.usage?.total_tokens,
      },
    });

    return NextResponse.json({
      response,
      usage: completion.usage,
    });
  } catch (error) {
    console.error('AI tutor error:', error);
    return NextResponse.json(
      { error: 'AI tutor request failed' },
      { status: 500 }
    );
  }
}
