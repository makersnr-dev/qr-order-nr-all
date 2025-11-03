import { Card } from '@/lib/ui';
export default function SuperAdmin(){
  return (
    <main className="container">
      <h1 style={{fontSize:26, fontWeight:800}}>전역 관리자</h1>
      <Card>
        <div className="muted">여러 매장 관리는 전역관리자만 접근합니다. (샘플)</div>
      </Card>
    </main>
  );
}
