'use client';
import { Card, Button, Input, Select } from '@/lib/ui';
import TossPayments from '@tosspayments/tosspayments-sdk';

import { useState } from 'react';

export default function DeliveryReservation({ params }:{ params:{ storeSlug:string }}){
  const [mode, setMode] = useState<'delivery'|'reservation'>('delivery');
  const [bankInfo] = useState({ bank:'은행명', accountNo:'000-0000-0000', holder:'예금주' });

  const [items, setItems] = useState([{name:'아메리카노', price:3000, qty:0},{name:'라떼', price:4000, qty:0}]);

  const subtotal = items.reduce((s,i)=>s+i.price*i.qty,0);

  
  async function submit(){
    const itemsPayload = items.filter(i=>i.qty>0).map(i=>({ name:i.name, price:i.price, qty:i.qty }));
    const subtotal = itemsPayload.reduce((s,i)=>s+i.price*i.qty,0);
    // 예약 모드면 결제 없이 주문 생성만
    if (mode==='reservation'){
      const res = await fetch(`/api/${params.storeSlug}/orders`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ type:'DELIVERY', mode, items: itemsPayload, subtotal, total: subtotal })});
      const js = await res.json();
      if (!js?.ok) { alert('예약 생성 실패'); return; }
      window.location.href = `/${params.storeSlug}/orders/${js.orderId}`;
      return;
    }
    // 배달 결제
    const res = await fetch(`/api/${params.storeSlug}/orders`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ type:'DELIVERY', items: itemsPayload, subtotal, total: subtotal })});
    const js = await res.json();
    if (!js?.ok) { alert('주문 생성 실패'); return; }
    const orderId = js.orderId;
    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY as string;
    if (!clientKey){ alert('TOSS 클라이언트키가 설정되어 있지 않아요(.env)'); return; }
    const tossPayments = TossPayments(clientKey);
    const tossPayments = TossPayments(clientKey);
await tossPayments.payment.requestPayment({
  method: 'CARD',
  amount: { value: subtotal || 100, currency: 'KRW' },
  orderId,
  orderName,
  successUrl: `${window.location.origin}/pay/success?orderId=${orderId}`,
  failUrl: `${window.location.origin}/pay/fail`,
});
}
  }


  const copy = async (text:string)=>{
    try{ await navigator.clipboard.writeText(text); alert('복사했어요'); }catch{}
  };

  return (
    <main className="container">
      <h1 style={{fontSize:26, fontWeight:800}}>배달/예약</h1>

      <Card>
        <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:8}}>
          <label><input type="radio" name="m" checked={mode==='delivery'} onChange={()=>setMode('delivery')} /> 배달(결제)</label>
          <label><input type="radio" name="m" checked={mode==='reservation'} onChange={()=>setMode('reservation')} /> 예약(무결제)</label>
        </div>
      </Card>

      <div className="grid" style={{gridTemplateColumns:'1fr', gap:16}}>
        <Card>
          <div style={{fontWeight:700, marginBottom:8}}>배달/예약 정보 *</div>
          <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:12}}>
            <div><div className="muted small">주소</div><Input placeholder="배송지 주소 *" /></div>
            <div><div className="muted small">주문자</div><Input placeholder="주문자 이름 *" /></div>
            <div><div className="muted small">연락처</div><Input placeholder="연락처(숫자만) *" /></div>
            <div><div className="muted small">예약일자</div><Input placeholder="연도-월-일" /></div>
            <div><div className="muted small">예약시간</div>
              <div className="grid" style={{gridTemplateColumns:'1fr 1fr 1fr', gap:8}}>
                <Select defaultValue="오전/오후"><option>오전/오후</option><option>오전</option><option>오후</option></Select>
                <Select defaultValue="시">{Array.from({length:12},(_,i)=><option key={i+1}>{i+1}</option>)}</Select>
                <Select defaultValue="분">{[0,5,10,15,20,25,30,35,40,45,50,55].map(v=> <option key={v}>{v:02d}</option>)}</Select>
              </div>
            </div>
          </div>
          {mode==='reservation' && (
            <div style={{marginTop:16}}>
              <div className="muted small" style={{marginBottom:6}}>입금 계좌</div>
              <div className="grid" style={{gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:8}}>
                <div>은행: <b>{bankInfo.bank}</b></div>
                <div>계좌번호: <b>{bankInfo.accountNo}</b></div>
                <div>예금주: <b>{bankInfo.holder}</b></div>
                <Button variant="outline" onClick={()=>copy(f"{bankInfo.bank} {bankInfo.accountNo} {bankInfo.holder}")}>전체 복사</Button>
              </div>
            </div>
          )}
        </Card>

        <Card>
          <div className="muted small">메뉴</div>
          <div className="grid" style={{gridTemplateColumns:'repeat(3, 1fr)', gap:12}}>
            {items.map((m,idx)=> (
              <div key={idx} className="rounded-xl p-4 bg-white/5 border border-white/10">
                <div style={{fontWeight:700}}>{m.name}</div>
                <div className="small muted">{m.price.toLocaleString()}원</div>
                <div className="grid" style={{gridTemplateColumns:'repeat(3,1fr)', marginTop:8, gap:8}}>
                  <Button variant="ghost" onClick={()=>setItems(prev=>prev.map((x,i)=> i===idx? {...x, qty: Math.max(0,x.qty-1)}:x))}>-</Button>
                  <div className="badge" style={{textAlign:'center', lineHeight:'28px'}}>{m.qty}</div>
                  <Button variant="ghost" onClick={()=>setItems(prev=>prev.map((x,i)=> i===idx? {...x, qty: x.qty+1}:x))}>+</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>합계: <b>{subtotal.toLocaleString()}</b>원</div>
            <Button onClick={submit}>{mode==='reservation' ? '예약하기' : '결제하기'}</Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
