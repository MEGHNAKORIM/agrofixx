import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { UpdateOrderStatusInput } from '../../../lib/types';

export async function GET(
  request: NextRequest,
  {params}: {params: Promise<{ id: string }>}
) {
  const { id } = await params;

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Failed to fetch order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  {params}: {params: Promise<{ id: string }>}
) {
  const { id } = await params;

  try {
    const body: UpdateOrderStatusInput = await request.json();

    const order = await prisma.order.update({
      where: { id },
      data: { status: body.status },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}