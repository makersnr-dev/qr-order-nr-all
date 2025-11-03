import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest, { params }:{ params:{ storeSlug: string }}){
  const store = await prisma.store.findUnique({ where: { slug: params.storeSlug }});
  if (!store) return new Response('store not found', { status: 404 });
  const body = await req.json();
  const rec = await prisma.staffCall.create({
    data: {
      storeId: store.id,
      tableNumber: body.tableNumber ?? null,
      type: body.type ?? 'OTHER',
      note: body.note ?? null,
    }
  });
  return Response.json({ ok:true, id: rec.id });
}

export async function GET(req: NextRequest, { params }:{ params:{ storeSlug: string }}){
  const store = await prisma.store.findUnique({ where: { slug: params.storeSlug }});
  if (!store) return new Response('store not found', { status: 404 });
  const calls = await prisma.staffCall.findMany({ where: { storeId: store.id }, orderBy: { createdAt: 'desc' }, take: 50 });
  return Response.json({ ok:true, calls });
}
