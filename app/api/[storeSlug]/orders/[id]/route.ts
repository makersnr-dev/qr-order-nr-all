import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest, { params }:{ params:{ storeSlug: string; id:string }}){
  const store = await prisma.store.findUnique({ where: { slug: params.storeSlug }});
  if (!store) return new Response('store not found', { status: 404 });
  const order = await prisma.order.findUnique({ where: { id: params.id }});
  if (!order || order.storeId !== store.id) return new Response('order not found', { status: 404 });
  return Response.json({ ok:true, order });
}
