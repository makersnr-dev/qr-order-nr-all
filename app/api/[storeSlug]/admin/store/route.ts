import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: { storeSlug: string }}){
  const body = await req.json().catch(()=>({}));
  const name = (body?.name ?? '').toString().trim();
  if (!name || name.length < 2) return new Response('name too short', { status: 400 });
  const store = await prisma.store.findUnique({ where: { slug: params.storeSlug }});
  if (!store) return new Response('store not found', { status: 404 });
  const updated = await prisma.store.update({ where: { id: store.id }, data: { name }});
  return Response.json({ ok: true, store: { id: updated.id, name: updated.name } });
}
