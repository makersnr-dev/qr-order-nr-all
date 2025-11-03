'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, Button } from '@/lib/ui';

export default function PaySuccess(){
  const sp = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<{ok:boolean; msg:string; orderId?:string} | null>(null);

  useEffect(()=>{
    const paymentKey = sp.get('paymentKey');
    const orderId = sp.get('orderId');
    const amount = sp.get('amount');
    async function confirm(){
      const res = await fetch('/api/payments/confirm', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ paymentKey, orderId, amount: Number(amount||0) })
      });
      const js = await res.json();
      if (js?.ok){
        // 주문 상태를 CONFIRM으로 업데이트
        // storeSlug를 추정할 수 없으니 서버에서 주문ID로 업데이트하도록 간단 PATCH
        try{
          const storeSlug = (js.data?.orderId || orderId || '').split('_')[0] || '';
          if (storeSlug){
            await fetch(`/api/${storeSlug}/orders/${orderId}/actions`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action:'CONFIRM' }) });
          }
        }catch{}
        setState({ ok:true, msg:'결제가 완료되었습니다.', orderId: orderId || undefined });
      }else{
        setState({ ok:false, msg:'결제 승인에 실패했습니다.' });
      }
    }
    confirm();
  },[]);

  return (
    <main className="container">
      <h1 style={{fontSize:26, fontWeight:800}}>결제 결과</h1>
      <Card>
        {!state ? <div>승인 중…</div> :
         state.ok ? <div>성공! 주문ID: <b>{state.orderId}</b></div> :
         <div>실패: {state.msg}</div>}
      </Card>
      <div style={{marginTop:12}}>
        <Button onClick={()=>router.push('/')}>홈으로</Button>
      </div>
    </main>
  );
}
