import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(req: NextRequest, { params }:{ params:{ storeSlug: string; id:string }}){
  const store = await prisma.store.findUnique({ where: { slug: params.storeSlug }});
  if (!store) return new Response('store not found', { status: 404 });
  const body = await req.json().catch(()=>({}));
  const status = (body.status ?? '').toString().toUpperCase();
  if (!['PENDING','ACK','DONE'].includes(status)) return new Response('bad status', { status: 400 });
  const rec = await prisma.staffCall.updateMany({ where: { id: params.id, storeId: store.id }, data: { status } });
  if (rec.count === 0) return new Response('not found', { status: 404 });
  return Response.json({ ok:true });
}
