import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest, { params }:{ params:{ storeSlug:string }}){
  const store = await prisma.store.findUnique({ where: { slug: params.storeSlug }});
  if (!store) return new Response('store not found', { status: 404 });
  const url = new URL(req.url);
  const start = url.searchParams.get('start');
  const end = url.searchParams.get('end');
  const where:any = { storeId: store.id };
  if (start || end){
    where.createdAt = {};
    if (start) where.createdAt.gte = new Date(start);
    if (end) where.createdAt.lt = new Date(end);
  }
  const rows = await prisma.order.findMany({ where, orderBy:{ createdAt:'desc' }, take: 1000 });
  const header = ["id","createdAt","type","tableNumber","status","subtotal","deliveryFee","total"];
  const csvRows = [header.join(",")];
  for (const r of rows){
    csvRows.push([r.id, r.createdAt.toISOString(), r.type, r.tableNumber??"", r.status, r.subtotal, r.deliveryFee??"", r.total].join(","));
  }
  return new Response(csvRows.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="orders.csv"`,
    }
  });
}
