import Link from 'next/link';
import { DEFAULT_STORE } from '@/lib/constants';
import { Card } from '@/lib/ui';

export default function Stores(){
  return (
    <main className="container">
      <h1 style={{fontSize:26, fontWeight:800}}>매장 목록</h1>
      <Card>
        <div className="grid" style={{gridTemplateColumns:'1fr'}}>
          <div>
            <div style={{fontSize:18, fontWeight:700}}>{DEFAULT_STORE.name}</div>
            <div className="muted small">{DEFAULT_STORE.address} · {DEFAULT_STORE.phone}</div>
            <div className="small" style={{marginTop:8}}>※ 이 화면은 정보용입니다. 주문은 QR로만 가능합니다.</div>
            <div style={{marginTop:8}}><Link href={`/stores/${DEFAULT_STORE.slug}`}>자세히 보기 →</Link></div>
          </div>
        </div>
      </Card>
    </main>
  );
}
