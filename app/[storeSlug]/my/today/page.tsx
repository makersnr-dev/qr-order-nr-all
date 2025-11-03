'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/lib/ui';

export default function TodayOrders({ params }:{ params:{ storeSlug:string }}){
  const [rows, setRows] = useState<any[]>([]);
  useEffect(()=>{
    const guestKey = localStorage.getItem('guestKey') || (()=>{ const k = crypto.randomUUID(); localStorage.setItem('guestKey', k); return k; })();
    (async()=>{
      const since = new Date(); since.setHours(0,0,0,0);
      const res = await fetch(`/api/${params.storeSlug}/orders?since=${since.toISOString()}`);
      const js = await res.json();
      // 샘플: 실제론 서버에서 guestKey/userId로 필터해야 함
      setRows(js.orders||[]);
    })();
  },[]);

  return (
    <main className="container">
      <h1 style={{fontSize:26, fontWeight:800}}>오늘 주문</h1>
      {!rows.length ? <div className="muted">없음</div> :
        rows.map((r:any)=>(
          <Card key={r.id}>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <div>주문ID: <b>{r.id}</b></div>
              <div><span className="badge">{r.status}</span></div>
            </div>
            <div className="small">총액 { (r.total||0).toLocaleString() }원 · { new Date(r.createdAt).toLocaleString() }</div>
          </Card>
        ))
      }
    </main>
  );
}
