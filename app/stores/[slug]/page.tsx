import { DEFAULT_STORE } from '@/lib/constants';
import { Card, Button } from '@/lib/ui';

export default function StoreInfo({ params }: { params: { slug: string }}){
  const store = DEFAULT_STORE; // 샘플
  return (
    <main className="container">
      <h1 style={{fontSize:26, fontWeight:800}}>{store.name}</h1>
      <Card>
        <div className="grid" style={{gridTemplateColumns:'1fr 1fr'}}>
          <div>
            <div className="muted">주소</div>
            <div>{store.address}</div>
          </div>
          <div>
            <div className="muted">연락처</div>
            <div>{store.phone}</div>
          </div>
        </div>
        <div className="small" style={{marginTop:12}}>주문은 테이블 QR을 스캔해주세요.</div>
      </Card>
    </main>
  );
}
