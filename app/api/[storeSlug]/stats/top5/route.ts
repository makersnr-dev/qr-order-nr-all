import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';

type Item = { name?: string; menuId?: string; qty?: number; price?: number };

export async function GET(req: NextRequest, { params }:{ params:{ storeSlug:string }}){
  const store = await prisma.store.findUnique({ where: { slug: params.storeSlug }});
  if (!store) return new Response('store not found', { status: 404 });
  const url = new URL(req.url);
  const start = url.searchParams.get('start'); // ISO date
  const end = url.searchParams.get('end');     // ISO date
  const where:any = { storeId: store.id, status: { in: ['CONFIRMED','READY','COMPLETED','REFUNDED'] }};
  if (start || end){
    where.createdAt = {};
    if (start) where.createdAt.gte = new Date(start);
    if (end) where.createdAt.lt = new Date(end);
  }
  const orders = await prisma.order.findMany({ where, select: { itemsJson: true }});
  const counter = new Map<string, number>();
  for (const o of orders){
    const items = (o.itemsJson as any[] ?? []) as Item[];
    for (const it of items){
      const key = (it.name || it.menuId || 'unknown');
      const qty = Number(it.qty ?? 1);
      counter.set(key, (counter.get(key) ?? 0) + qty);
    }
  }
  const arr = Array.from(counter.entries()).map(([name, count])=>({ name, count })).sort((a,b)=> b.count - a.count).slice(0,5);
  return Response.json({ ok:true, top5: arr });
}
