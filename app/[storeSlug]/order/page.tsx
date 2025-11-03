import Link from 'next/link';
import { Card, Button } from '@/lib/ui';

export default function OrderMode({ params }:{ params:{ storeSlug:string }}){
  const base = `/${params.storeSlug}/order`;
  return (
    <main className="container">
      <h1 style={{fontSize:26, fontWeight:800}}>주문 모드 선택</h1>
      <Card>
        <div className="grid" style={{gridTemplateColumns:'1fr', gap:12}}>
          <Link href={`${base}/store`}><Button className="w-full">매장</Button></Link>
          <Link href={`${base}/delivery-reservation`}><Button className="w-full" variant="secondary">배달/예약</Button></Link>
          <div className="small muted">※ 실제 운영 시 QR 토큰이 있어야 이 페이지에 접근할 수 있게 설정합니다.</div>
        </div>
      </Card>
    </main>
  );
}
