import { NextRequest } from 'next/server';

export async function POST(req: NextRequest){
  const { paymentKey, cancelReason, cancelAmount } = await req.json();
  const secretKey = process.env.TOSS_SECRET_KEY;
  if (secretKey && secretKey.startsWith('sk_')){
    const basicToken = Buffer.from(`${secretKey}:`).toString('base64');
    const res = await fetch(`https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`, {
      method: 'POST',
      headers: { 'Authorization': `Basic ${basicToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ cancelReason, cancelAmount })
    });
    const data = await res.json();
    if (!res.ok) return Response.json({ ok:false, error:data }, { status: 400 });
    return Response.json({ ok: true, data });
  } else {
    return Response.json({ ok:true, data: { mock: true, canceledAt: new Date().toISOString() }});
  }
}
