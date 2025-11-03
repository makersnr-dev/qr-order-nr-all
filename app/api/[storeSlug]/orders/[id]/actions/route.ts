import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(req: NextRequest, { params }:{ params:{ storeSlug:string; id:string }}){
  const body = await req.json();
  const store = await prisma.store.findUnique({ where: { slug: params.storeSlug }});
  if (!store) return new Response('store not found', { status: 404 });

  const order = await prisma.order.findUnique({ where: { id: params.id }});
  if (!order || order.storeId !== store.id) return new Response('order not found', { status: 404 });

  const action = body.action;
  if (action === 'CONFIRM'){
    const updated = await prisma.order.update({ where: { id: order.id }, data: { status: 'CONFIRMED', confirmedAt: new Date() }});
    return Response.json({ ok:true, status: updated.status });
  }
  if (action === 'READY'){
    const updated = await prisma.order.update({ where: { id: order.id }, data: { status: 'READY', readyAt: new Date() }});
    return Response.json({ ok:true, status: updated.status });
  }
  if (action === 'COMPLETE'){
    const updated = await prisma.order.update({ where: { id: order.id }, data: { status: 'COMPLETED', completedAt: new Date() }});
    return Response.json({ ok:true, status: updated.status });
  }
  if (action === 'CANCEL'){
    const updated = await prisma.order.update({ where: { id: order.id }, data: { status: 'CANCELED', canceledAt: new Date(), cancelReason: body.reason ?? null }});
    return Response.json({ ok:true, status: updated.status });
  }
  if (action === 'REFUND'){
    const amount = Number(body.amount ?? order.total);
    const updated = await prisma.order.update({ where: { id: order.id }, data: { status: 'REFUND_PENDING', refundAmount: amount }});
    return Response.json({ ok:true, status: updated.status });
  }
  return new Response('unknown action', { status: 400 });
}
