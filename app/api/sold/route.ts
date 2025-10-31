import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET() {
  try {
    const solds = await prisma.sold.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ solds }, { status: 200 });
  } catch (err: any) {
    console.error('Error fetching sold items:', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // defensive parsing + logging for easier debugging
    const buyerName = typeof body.buyerName === 'string' ? body.buyerName : '';
    const phoneNumber = typeof body.phoneNumber === 'string' ? body.phoneNumber : '';
    const computerModel = typeof body.computerModel === 'string' ? body.computerModel : '';
    const specifications = typeof body.specifications === 'string' ? body.specifications : '';
    const warranty = typeof body.warranty === 'string' ? body.warranty : String(body.warranty || '');
    const salesPrice = typeof body.salesPrice === 'number' ? body.salesPrice : parseInt(body.salesPrice, 10) || 0;

    // basic validation
    if (!buyerName || !computerModel) {
      return NextResponse.json({ error: 'buyerName and computerModel are required' }, { status: 400 });
    }

    const imagePath = typeof body.imagePath === 'string' ? body.imagePath : '';
    console.log('Creating sold record', { buyerName, phoneNumber, computerModel, salesPrice, specifications, warranty, imagePath });

    const data: any = {
      buyerName,
      phoneNumber,
      computerModel,
      salesPrice,
      specifications,
      warranty,
    };
    if (imagePath) data.imagePath = imagePath;

    const sold = await prisma.sold.create({ data });

    return NextResponse.json({ sold }, { status: 201 });
  } catch (err: any) {
    console.error('Error creating sold record:', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
