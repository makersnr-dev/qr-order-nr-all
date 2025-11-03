'use client';
import { Card, Button, Input, Select } from '@/lib/ui';
import TossPayments from '@tosspayments/tosspayments-sdk';

import { useState } from 'react';

type Item={ id:string; name:string; price:number; qty:number };

const SAMPLE_MENU: Item[] = [
  {id:'americano', name:'아메리카노', price:3000, qty:0},
  {id:'latte', name:'라떼', price:4000, qty:0},
  {id:'croissant', name:'크로와상', price:3500, qty:0},
];

export default function StoreOrder({ params }:{ params:{ storeSlug:string }}){
  const [table, setTable] = useState('');
  const [code, setCode] = useState('');
  const [items, setItems] = useState(SAMPLE_MENU);
  const [call, setCall] = useState('');

  async function callSend(){
    const type = call||'OTHER';
    await fetch(`/api/${params.storeSlug}/staff-calls`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ tableNumber: table? Number(table): null, type }) });
    alert('호출을 보냈어요');
  }

  const subtotal = items.reduce((s,i)=>s+i.price*i.qty,0);
  
  async function submit(){
    const itemsPayload = items.filter(i=>i.qty>0).map(i=>({ menuId:i.id, name:i.name, price:i.price, qty:i.qty }));
    const subtotal = itemsPayload.reduce((s,i)=>s+i.price*i.qty,0);
    // 1) 주문 먼저 생성
    const res = await fetch(`/api/${params.storeSlug}/orders`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ type:'STORE', tableNumber: table? Number(table): null, items: itemsPayload, subtotal, total: subtotal })});
    const js = await res.json();
    if (!js?.ok) { alert('주문 생성 실패'); return; }
    const orderId = js.orderId;
    // 2) Toss 호출
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

  return (
    <main className="container">
      <h1 style={{fontSize:26, fontWeight:800}}>매장주문</h1>

      <div className="grid" style={{gridTemplateColumns:'1fr', gap:16}}>
        <Card>
          <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:12}}>
            <div>
              <div className="muted small">테이블</div>
              <Input placeholder="예: 12" value={table} onChange={e=>setTable(e.target.value)} />
            </div>
            <div>
              <div className="muted small">오늘의 결제 코드</div>
              <Input placeholder="관리자에게 받은 4자리" value={code} onChange={e=>setCode(e.target.value)} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="muted small">직원 호출</div>
          <div className="grid" style={{gridTemplateColumns:'1fr auto', gap:12}}>
            <Select value={call} onChange={e=>setCall(e.target.value)}>
              <option value="">선택 없음</option>
              <option value="WATER">물/물수건</option>
              <option value="CLEANUP">정리 요청</option>
              <option value="CHECKOUT">계산/결제 요청</option>
              <option value="OTHER">기타</option>
            </Select>
            <Button variant="secondary" onClick={callSend}>직원 호출</Button>
          </div>
        </Card>

        <Card>
          <div className="muted small">메뉴</div>
          <div className="grid" style={{gridTemplateColumns:'repeat(3, 1fr)', gap:12}}>
            {items.map((m,idx)=> (
              <div key={m.id} className="rounded-xl p-4 bg-white/5 border border-white/10">
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
            <Button disabled={subtotal===0} onClick={submit}>결제하기</Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
