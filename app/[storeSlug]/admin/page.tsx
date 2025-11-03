'use client';
import { Card, Button, Input } from '@/lib/ui';
import { useState, useEffect, useRef } from 'react';
import { smartPoll, bumpReqCount, getReqCount } from '@/lib/poll';

type Tab = 'account'|'store'|'qr'|'menu'|'code'|'alerts'|'orders';
const TABS: {key:Tab; label:string}[] = [
  {key:'account', label:'입금계좌'},
  {key:'store', label:'매장'},
  {key:'qr', label:'QR 배포'},
  {key:'menu', label:'메뉴 관리'},
  {key:'code', label:'결제 코드'},
  {key:'alerts', label:'알림 설정'},
  {key:'orders', label:'배달/예약'},
  {key:'calls', label:'직원 호출'},
];

export default function Admin(){
  const [tab, setTab] = useState<Tab>('account');
  const [storeName, setStoreName] = useState('나래카페 본점');

  return (
    <main className="container">
      <h1 style={{fontSize:26, fontWeight:800}}>관리자 콘솔</h1>
      <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:12}}>
        {TABS.map(t=> <Button key={t.key} variant={tab===t.key?'primary':'secondary'} onClick={()=>setTab(t.key)}>{t.label}</Button>)}
      </div>

      {tab==='store' && (
        <Card>
          <div style={{fontWeight:700, marginBottom:12}}>기본 정보</div>
          <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:12}}>
            <div><div className="muted small">매장명</div><Input value={storeName} onChange={e=>setStoreName(e.target.value)} /></div>
            <div><div className="muted small">연락처</div><Input placeholder="033-731-1800" /></div>
            <div><div className="muted small">주소</div><Input placeholder="강원도 원주시 무실동" /></div>
            <div><div className="muted small">영업시간</div><Input placeholder="09:00 ~ 22:00" /></div>
          </div>
          <div style={{marginTop:12}}><Button>저장</Button></div>
        </Card>
      )}

      {tab==='qr' && (
        <Card>
          <div style={{fontWeight:700, marginBottom:12}}>QR 생성/다운로드</div>
          <div className="grid" style={{gridTemplateColumns:'1fr auto', gap:12}}>
            <Input placeholder="테이블 번호 (예: 12)" />
            <Button variant="secondary">PNG 다운로드</Button>
          </div>
          <div className="small muted" style={{marginTop:12}}>QR 이미지는 목록에서 작게 보이고 클릭 시 크게 미리보기.</div>
          <div className="grid" style={{gridTemplateColumns:'repeat(5, 1fr)', gap:12, marginTop:12}}>
            {Array.from({length:5},(_,i)=> (
              <div key={i} className="rounded-xl p-2 bg-white/5 border border-white/10">
                <div className="small muted">테이블 {i*2+5}</div>
                <div style={{height:100, background:'#000', borderRadius:8, marginTop:6}}/>
                <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:8, marginTop:8}}>
                  <Button variant="outline">다운로드</Button>
                  <Button variant="outline">삭제</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {tab==='account' && (
        <Card>
          <div style={{fontWeight:700, marginBottom:12}}>입금 계좌 관리</div>
          <div className="grid" style={{gridTemplateColumns:'repeat(3, 1fr)', gap:12}}>
            <div><div className="muted small">은행</div><Input placeholder="은행명" /></div>
            <div><div className="muted small">계좌번호</div><Input placeholder="숫자 및 - 포함" /></div>
            <div><div className="muted small">예금주</div><Input placeholder="예금주" /></div>
          </div>
          <div style={{marginTop:12}}><Button>저장</Button></div>
        </Card>
      )}

      {tab==='menu' && (
        <Card>
          <div style={{fontWeight:700, marginBottom:12}}>메뉴 관리</div>
          <div className="grid" style={{gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:8, alignItems:'center'}}>
            <Input placeholder="이름" />
            <Input placeholder="가격" />
            <div className="small muted">활성</div>
            <Button variant="secondary">추가</Button>
          </div>
          <div className="grid" style={{gridTemplateColumns:'1fr', gap:8, marginTop:12}}>
            {['아메리카노','라떼','크로와상'].map((n,i)=>(
              <div key={i} className="grid" style={{gridTemplateColumns:'1fr 120px 80px 120px', gap:8, alignItems:'center'}}>
                <Input defaultValue={n} />
                <Input defaultValue={i===0?3000:i===1?4000:3500} />
                <div><input type="checkbox" defaultChecked /> 활성</div>
                <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:8}}>
                  <Button variant="outline">저장</Button>
                  <Button variant="outline">삭제</Button>
                </div>
              </div>
            ))}
          </div>
          <div style={{marginTop:12}}>
            <input type="file" />
            <Button variant="secondary" className="ml-2">엑셀 업로드</Button>
          </div>
        </Card>
      )}

      {tab==='code' && (
        <Card>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <div className="badge">오늘의 결제 코드</div>
              <div style={{fontSize:20, fontWeight:800, marginTop:4}}>7111</div>
              <div className="small muted">자정까지 남은 시간: 13시간 24분</div>
            </div>
            <div className="grid" style={{gridTemplateColumns:'repeat(3,1fr)', gap:8}}>
              <Button variant="outline">복사</Button>
              <Button variant="outline">새 코드 발급</Button>
              <Button variant="outline">기본 코드로 되돌리기</Button>
            </div>
          </div>
        </Card>
      )}

      {tab==='alerts' && (
        <Card>
          <div style={{fontWeight:700, marginBottom:12}}>알림 설정/점검</div>
          <Button variant="secondary">확인 중…</Button>
        </Card>
      )}

      
{tab==='orders' && (
  <Card>
    <audio id="beep" preload="auto" src="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABYAAAChAAAAAAA="></audio>
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
      <div style={{fontWeight:700, marginBottom:12}}>배달/예약 주문</div>
      <div className="small muted">새 주문이 오면 소리가 납니다.</div>
    </div>
    <OrderListWithSound />
  </Card>
)}

    </main>
  );
}


function QrManager(){
  const [tableNo, setTableNo] = useState<string>('');
  const [items, setItems] = useState<{id:string; table?:number; url:string; png:string; exp:string}[]>([]);
  const storeSlug = typeof window !== 'undefined' ? window.location.pathname.split('/').filter(Boolean)[0] : '';

  async function issue(){
    if (!storeSlug) return;
    const res = await fetch(`/api/${storeSlug}/admin/qr/issue`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ tableNumber: tableNo? Number(tableNo): undefined })
    });
    const data = await res.json();
    if (data?.ok){
      setItems(prev=> [{id:data.id, table: Number(tableNo)||undefined, url:data.url, png:data.pngDataUrl, exp:data.expiresAt}, ...prev]);
      setTableNo('');
    }else{
      alert('발급 실패');
    }
  }

  function download(pngDataUrl:string, name:string){
    const a = document.createElement('a');
    a.href = pngDataUrl;
    a.download = `${name}.png`;
    a.click();
  }

  return (
    <div>
      <div className="grid" style={{gridTemplateColumns:'1fr auto', gap:12}}>
        <Input placeholder="테이블 번호 (선택)" value={tableNo} onChange={e=>setTableNo(e.target.value)} />
        <Button variant="secondary" onClick={issue}>QR 생성</Button>
      </div>
      <div className="small muted" style={{marginTop:12}}>QR 이미지는 작게 보여지고, 다운로드로 저장할 수 있어요. (30일 유효)</div>
      <div className="grid" style={{gridTemplateColumns:'repeat(5, 1fr)', gap:12, marginTop:12}}>
        {items.map((it)=> (
          <div key={it.id} className="rounded-xl p-2 bg-white/5 border border-white/10">
            <div className="small muted">{it.table?`테이블 ${it.table}`:'매장 공용'}</div>
            <img src={it.png} alt="qr" style={{height:100, width:'100%', objectFit:'contain', borderRadius:8, marginTop:6}}/>
            <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:8, marginTop:8}}>
              <Button variant="outline" onClick={()=>download(it.png, it.table?`table-${it.table}`:'store')}>다운로드</Button>
              <a href={it.url} target="_blank" rel="noreferrer"><Button variant="outline">열기</Button></a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function OrderListWithSound(){
  async function action(id:string, act:string){
    const res = await fetch(`/api/${typeof window!=='undefined'?window.location.pathname.split('/').filter(Boolean)[0]:''}/orders/${id}/actions`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ action: act }) });
  }

  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement|null>(null);
  const storeSlug = typeof window !== 'undefined' ? window.location.pathname.split('/').filter(Boolean)[0] : '';

  useEffect(()=>{
    audioRef.current = document.getElementById('beep') as HTMLAudioElement;
    let prevIds = new Set<string>();
    async function load(){ bumpReqCount(1);
      const res = await fetch(`/api/${storeSlug}/orders`);
      const js = await res.json();
      setRows(js.orders || []);
      const nowIds = new Set((js.orders||[]).map((o:any)=>o.id));
      // if new ids appear, play
      let newFound = false;
      for (const id of nowIds){ if (!prevIds.has(id)) { newFound = true; break; } }
      if (newFound && prevIds.size>0){
        audioRef.current?.play().catch(()=>{});
      }
      prevIds = nowIds;
      setLoading(false);
    }
    load();
    const stop = smartPoll(load, Number(process.env.NEXT_PUBLIC_FREE_MODE_POLL_INTERVAL_MS||'600000'), Number(process.env.NEXT_PUBLIC_FREE_MODE_MAX_REQUESTS_PER_DAY||'100'));
    return ()=> stop();
  },[]);

  if (loading) return <div className="muted">불러오는 중…</div>;

  if (!rows.length) return <div className="muted">데이터 없음</div>;

  const storeSlug = typeof window !== 'undefined' ? window.location.pathname.split('/').filter(Boolean)[0] : '';
  return (
    <div>
      <div style={{textAlign:'right', marginBottom:8}}><a className="badge" href={`/api/${storeSlug}/orders/export`} target="_blank">CSV 다운로드</a></div>
      <div style={{display:'flex', gap:8, justifyContent:'flex-end', margin:'6px 0'}}>
  <button className="badge" onClick={load}>수동 새로고침</button>
  <span className="muted small">오늘 사용: {getReqCount()}회</span>
</div>
<table className="table">
      <thead><tr><th>시간</th><th>타입</th><th>테이블</th><th>금액</th><th>상태</th><th>액션</th><th>상세</th></tr></thead>
      <tbody>
        {rows.map((r:any)=> (
          <tr key={r.id}>
            <td>{new Date(r.createdAt).toLocaleString()}</td>
            <td>{r.type}</td>
            <td>{r.tableNumber||'-'}</td>
            <td>{(r.total||0).toLocaleString()}원</td>
            <td><span className="badge">{r.status}</span></td>
            <td>
              <div className="grid" style={{gridTemplateColumns:'repeat(3,1fr)', gap:6}}>
                <button className="badge" onClick={()=>action(r.id,'CONFIRM')}>확인</button>
                <button className="badge" onClick={()=>action(r.id,'READY')}>준비</button>
                <button className="badge" onClick={()=>action(r.id,'COMPLETE')}>완료</button>
                <button className="badge" onClick={()=>action(r.id,'CANCEL')}>취소</button>
                <button className="badge" onClick={()=>action(r.id,'REFUND')}>환불</button>
              </div>
            </td>
            <td><a href={`/${storeSlug}/orders/${r.id}`}>보기</a></td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}


function StaffCalls(){
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const audioRef = useRef<HTMLAudioElement|null>(null);
  const storeSlug = typeof window !== 'undefined' ? window.location.pathname.split('/').filter(Boolean)[0] : '';

  useEffect(()=>{
    audioRef.current = document.getElementById('beep2') as HTMLAudioElement;
    let prevIds = new Set<string>();
    async function load(){ bumpReqCount(1);
      const res = await fetch(`/api/${storeSlug}/staff-calls`);
      const js = await res.json();
      setRows(js.calls || []);
      const nowIds = new Set((js.calls||[]).map((o:any)=>o.id));
      let newFound = false;
      for (const id of nowIds){ if (!prevIds.has(id)) { newFound = true; break; } }
      if (newFound && prevIds.size>0){ audioRef.current?.play().catch(()=>{}); }
      prevIds = nowIds;
      setLoading(false);
    }
    load();
    const stop = smartPoll(load, Number(process.env.NEXT_PUBLIC_FREE_MODE_POLL_INTERVAL_MS||'600000'), Number(process.env.NEXT_PUBLIC_FREE_MODE_MAX_REQUESTS_PER_DAY||'100'));
    return ()=> stop();
  },[]);

  async function setStatus(id:string, status:'ACK'|'DONE'){
    await fetch(`/api/${storeSlug}/staff-calls/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ status }) });
  }

  if (loading) return <div className="muted">불러오는 중…</div>;
  if (!rows.length) return <div className="muted">호출 없음</div>;

  return (
    <div style={{display:'flex', gap:8, justifyContent:'flex-end', margin:'6px 0'}}>
  <button className="badge" onClick={load}>수동 새로고침</button>
  <span className="muted small">오늘 사용: {getReqCount()}회</span>
</div>
<table className="table">
      <thead><tr><th>시간</th><th>테이블</th><th>유형</th><th>상태</th><th>액션</th></tr></thead>
      <tbody>
        {rows.map((r:any)=> (
          <tr key={r.id}>
            <td>{new Date(r.createdAt).toLocaleString()}</td>
            <td>{r.tableNumber||'-'}</td>
            <td>{r.type}</td>
            <td><span className="badge">{r.status}</span></td>
            <td>
              <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:6}}>
                <button className="badge" onClick={()=>setStatus(r.id,'ACK')}>응답</button>
                <button className="badge" onClick={()=>setStatus(r.id,'DONE')}>완료</button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
