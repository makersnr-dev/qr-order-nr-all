import { NextRequest } from 'next/server';

export async function POST(req: NextRequest){
  const { paymentKey, orderId, amount } = await req.json();
  const secretKey = process.env.TOSS_SECRET_KEY;
  if (secretKey && secretKey.startsWith('sk_')){
    // Real request to Toss
    const basicToken = Buffer.from(`${secretKey}:`).toString('base64');
    const res = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: { 'Authorization': `Basic ${basicToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentKey, orderId, amount })
    });
    const data = await res.json();
    if (!res.ok) return Response.json({ ok:false, error:data }, { status: 400 });
    return Response.json({ ok: true, data });
  } else {
    // Mock success
    return Response.json({ ok:true, data: { mock: true, orderId, approvedAt: new Date().toISOString() }});
  }
}
