'use client';
import { useEffect, useRef, useState } from 'react';
import { Card, Button } from '@/lib/ui';

export default function OrderDetail({ params }:{ params:{ storeSlug:string; id:string }}){
  const [data, setData] = useState<any>(null);
  const [prevStatus, setPrevStatus] = useState<string>('');
  const audioRef = useRef<HTMLAudioElement>(null);

  async function fetchDetail(){
    const res = await fetch(`/api/${params.storeSlug}/orders/${params.id}`);
    const js = await res.json();
    setData(js.order);
    if (js.order?.status && prevStatus && js.order.status !== prevStatus){
      audioRef.current?.play().catch(()=>{});
    }
    setPrevStatus(js.order?.status || '');
  }

  useEffect(()=>{ fetchDetail(); const t=setInterval(fetchDetail, 5000); return ()=>clearInterval(t); },[]);

  if (!data) return <main className="container"><div>불러오는 중…</div></main>;

  const items = (data.itemsJson||[]) as any[];

  return (
    <main className="container">
      <audio ref={audioRef} preload="auto" src="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABYAAAChAAAAAAA=" />
      <div style={{display:'flex', justifyContent:'space-between',alignItems:'center'}}>
<h1 style={{fontSize:26, fontWeight:800}}>주문 상세</h1>
<button className="badge" onClick={load}>새로고침</button>
</div>
      <Card>
        <div>주문ID: <b>{data.id}</b></div>
        <div>상태: <span className="badge">{data.status}</span></div>
        <div>유형: {data.type}</div>
        {data.tableNumber ? <div>테이블: {data.tableNumber}</div> : null}
        <div>총액: <b>{(data.total||0).toLocaleString()}원</b></div>
      </Card>
      <Card>
        <div style={{fontWeight:700, marginBottom:8}}>내역</div>
        <ul>
          {items.map((it, idx)=> <li key={idx}>{it.name || it.menuId} × {it.qty} — {(it.price||0).toLocaleString()}원</li>)}
        </ul>
      </Card>
      <div className="small muted">상태가 바뀌면 소리가 납니다.</div>
    </main>
  );
}
