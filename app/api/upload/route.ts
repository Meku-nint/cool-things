import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import prisma from '../../../lib/prisma';

export const runtime = 'node';

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const name = form.get('name')?.toString() || null;
    const countField = form.get('count')?.toString();
    const count = countField ? parseInt(countField, 10) : 0;

    const file = form.get('file') as File | null;

    if (Number.isNaN(count) || count < 0) {
      return NextResponse.json({ error: 'Invalid count' }, { status: 400 });
    }

    let savedFileName: string | null = null;

    if (file && typeof file.name === 'string') {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

      await fs.mkdir(uploadsDir, { recursive: true });

      // prefix filename with timestamp to avoid collisions
      const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      const fullPath = path.join(uploadsDir, safeName);
      await fs.writeFile(fullPath, buffer);
      savedFileName = safeName;
    }

    // create DB record
    const computer = await prisma.computer.create({
      data: {
        name,
        count,
        fileName: savedFileName,
      },
    });

    return NextResponse.json({ computer }, { status: 201 });
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
