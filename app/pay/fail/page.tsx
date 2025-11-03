'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, Button } from '@/lib/ui';

export default function PayFail(){
  const sp = useSearchParams();
  const router = useRouter();
  const code = sp.get('code');
  const message = sp.get('message');
  return (
    <main className="container">
      <h1 style={{fontSize:26, fontWeight:800}}>결제 실패</h1>
      <Card>
        <div className="muted">code: {code}</div>
        <div>{message}</div>
      </Card>
      <div style={{marginTop:12}}>
        <Button onClick={()=>router.back()}>이전으로</Button>
      </div>
    </main>
  );
}
