import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest, { params }:{ params:{ storeSlug:string }}){
  const body = await req.json();
  const store = await prisma.store.findUnique({ where: { slug: params.storeSlug }});
  if (!store) return new Response('store not found', { status: 404 });

  // Business hours guard (Asia/Seoul)
  try{
    const KST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
    if (store.openTime && store.closeTime && body?.mode !== 'reservation'){
      const [oh,om] = (store.openTime||'09:00').split(':').map(Number);
      const [ch,cm] = (store.closeTime||'22:00').split(':').map(Number);
      const open = new Date(KST); open.setHours(oh||9, om||0, 0, 0);
      const close = new Date(KST); close.setHours(ch||22, cm||0, 0, 0);
      if (KST < open || KST > close) return new Response('closed', { status: 403 });
    }
  }catch{}


  const order = await prisma.order.create({
    data: {
      storeId: store.id,
      type: body.type === 'DELIVERY' ? 'DELIVERY' : 'STORE',
      tableNumber: body.tableNumber ?? null,
      userId: body.userId ?? null,
      guestKey: body.guestKey ?? null,
      status: 'PENDING',
      itemsJson: body.items ?? [],
      subtotal: body.subtotal ?? 0,
      deliveryFee: body.deliveryFee ?? null,
      total: body.total ?? body.subtotal ?? 0,
      note: body.note ?? null,
    }
  });

  return Response.json({ ok:true, orderId: order.id });
}

export async function GET(req: NextRequest, { params }:{ params:{ storeSlug:string }}){
  const store = await prisma.store.findUnique({ where: { slug: params.storeSlug }});
  if (!store) return new Response('store not found', { status: 404 });

  // Business hours guard (Asia/Seoul)
  try{
    const KST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
    if (store.openTime && store.closeTime && body?.mode !== 'reservation'){
      const [oh,om] = (store.openTime||'09:00').split(':').map(Number);
      const [ch,cm] = (store.closeTime||'22:00').split(':').map(Number);
      const open = new Date(KST); open.setHours(oh||9, om||0, 0, 0);
      const close = new Date(KST); close.setHours(ch||22, cm||0, 0, 0);
      if (KST < open || KST > close) return new Response('closed', { status: 403 });
    }
  }catch{}

  const url = new URL(req.url);
  const since = url.searchParams.get('since');
  const where:any = { storeId: store.id };
  if (since) where.createdAt = { gte: new Date(since) };
  const orders = await prisma.order.findMany({ where, orderBy: { createdAt: 'desc' }, take: 50 });
  return Response.json({ ok:true, orders });
}
