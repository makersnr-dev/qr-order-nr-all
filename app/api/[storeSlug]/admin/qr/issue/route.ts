import { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { signQrToken } from '@/lib/token';
import QRCode from 'qrcode';
import { SITE_DOMAIN } from '@/lib/constants';

export async function POST(req: NextRequest, { params }:{ params:{ storeSlug:string }}){
  const body = await req.json().catch(()=>({}));
  const tableNumber = body?.tableNumber ? Number(body.tableNumber) : undefined;
  const modes: string[] = Array.isArray(body?.modes) && body.modes.length ? body.modes : ['store','delivery','reservation'];

  const store = await prisma.store.findUnique({ where: { slug: params.storeSlug }});
  if (!store) return new Response('store not found', { status: 404 });

  const in30days = Math.floor(Date.now()/1000) + 60*60*24*30;
  const token = await signQrToken({ sid: store.id, tbl: tableNumber, modes, exp: in30days }, process.env.QR_SIGNING_SECRET || 'dev-secret');

  const path = `/${params.storeSlug}/order${tableNumber?'/store':''}`;
  const url = `${SITE_DOMAIN}${path}?token=${encodeURIComponent(token)}`;

  // Generate PNG as DataURL (small size)
  const pngDataUrl = await QRCode.toDataURL(url, { width: 320, margin: 1 });

  // Save DB
  const rec = await prisma.qrCode.create({
    data: {
      storeId: store.id,
      tableNumber: tableNumber ?? null,
      token,
      url,
      modes: modes.join(','),
      expiresAt: new Date(in30days*1000),
    }
  });

  return Response.json({ ok:true, id: rec.id, url, token, pngDataUrl, expiresAt: rec.expiresAt });
}
