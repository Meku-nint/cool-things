import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, count, fileName } = body;

    if (typeof count !== 'number' || Number.isNaN(count) || count < 0) {
      return NextResponse.json({ error: 'Invalid `count`. Must be a non-negative number.' }, { status: 400 });
    }

    const computer = await prisma.computer.create({
      data: {
        name: name || null,
        count,
        fileName: fileName || null,
      },
    });

    return NextResponse.json({ computer }, { status: 201 });
  } catch (err: any) {
    console.error('Error in /api/computers:', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const computers = await prisma.computer.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ computers }, { status: 200 });
  } catch (err: any) {
    console.error('Error fetching computers:', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
