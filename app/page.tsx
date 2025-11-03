import Link from 'next/link';
import { DEFAULT_STORE } from '@/lib/constants';
import { Card, Button } from '@/lib/ui';

export default function Home(){
  return (
    <main className="container">
      <h1 style={{fontSize:28, fontWeight:800}}>QR 오더 데모</h1>
      <p className="muted">아래 링크로 이동하세요.</p>
      <div className="grid" style={{gridTemplateColumns:'1fr'}}>
        <Card>
          <h3>매장 정보</h3>
          <p className="muted small">/stores & /stores/[store]</p>
          <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:8}}>
            <Link href="/stores"><Button variant="secondary">매장 목록</Button></Link>
            <Link href={`/stores/${DEFAULT_STORE.slug}`}><Button variant="secondary">샘플 매장 상세</Button></Link>
          </div>
        </Card>
        <Card>
          <h3>주문</h3>
          <div className="grid" style={{gridTemplateColumns:'repeat(3,1fr)', gap:8}}>
            <Link href={`/${DEFAULT_STORE.slug}/order`}><Button>주문 모드 선택</Button></Link>
            <Link href={`/${DEFAULT_STORE.slug}/order/store`}><Button variant="secondary">매장 주문 샘플</Button></Link>
            <Link href={`/${DEFAULT_STORE.slug}/order/delivery-reservation`}><Button variant="secondary">배달/예약 샘플</Button></Link>
          </div>
        </Card>
        <Card>
          <h3>관리자</h3>
          <div className="grid" style={{gridTemplateColumns:'1fr 1fr', gap:8}}>
            <Link href={`/${DEFAULT_STORE.slug}/admin`}><Button variant="outline">매장 관리자</Button></Link>
            <Link href="/superadmin"><Button variant="outline">전역 관리자</Button></Link>
          </div>
        </Card>
      </div>
      <div className="footer">도메인: https://qr-order-nr-a.vercel.app/</div>
    </main>
  );
}
