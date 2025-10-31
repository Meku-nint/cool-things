import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import prisma from '../../../lib/prisma';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const name = form.get('name')?.toString() || null;
    // we expect fields from the dashboard upload modal. Map them to the Unsold model
    const price = form.get('price')?.toString() || '';
    const brand = form.get('brand')?.toString() || '';
    const ram = form.get('ram')?.toString() || '';
    const storageType = form.get('storageType')?.toString() || '';
    const storageSize = form.get('storageSize')?.toString() || '';
    const processor = form.get('processor')?.toString() || '';
    const specifications = form.get('specifications')?.toString() || '';
    const file = form.get('file') as File | null;

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

    // create Unsold DB record
    const unsold = await prisma.unsold.create({
      data: {
        pcName: name || '',
        ram,
        storageType,
        storageSize,
        processor,
        brand,
        price,
        specifications,
        imagePath: savedFileName || '',
      },
    });

    return NextResponse.json({ unsold }, { status: 201 });
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
