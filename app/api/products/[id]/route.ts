import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function PUT(
  request: NextRequest,
  {params}: {params: Promise<{ id: string }>}
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const { name, description, price, stock, image } = body;
    const product = await prisma.product.update({
      where: { id },
      data: { name, description, price, stock, image },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const product = await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
