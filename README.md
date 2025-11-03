# QR Order MVP (Vercel + Neon + Prisma)

> 배포 주소(예시): https://qr-order-nr-a.vercel.app/

이 패키지는 **샘플 UI + 경량 로직**으로 구성된 MVP입니다.  
DB, 결제, 인증은 자리를 만들어 두었고, 값만 넣으면 확장됩니다.

---

## 0) 준비물
- Vercel 계정
- Neon(Postgres) 프로젝트
- (나중에) Toss Payments 테스트키

---

## 1) 이 파일로 시작하기 (초등학생도 OK)

1. 압축파일을 풀어요.
2. 폴더를 VS Code로 열어요.
3. 파일 `.env.example`을 복사해서 `.env`로 이름 바꾸고 아래만 바꿔 적어요.
   - `DATABASE_URL`: Neon에서 복사한 값 붙여넣기
   - `QR_SIGNING_SECRET`: 20자 이상 아무 영어/숫자 섞어서
   - (토스키는 나중에)
4. 터미널을 열고 아래 순서로 명령을 입력해요.

```bash
# 1) 패키지 설치
npm install

# 2) 프리즈마 스키마 DB 반영
npx prisma migrate dev --name init

# 3) 개발 서버 실행
npm run dev
```

5. 브라우저에서 `http://localhost:3000`을 열어요.
6. 화면이 뜨면:
   - `/stores` : 매장 정보 보기
   - `/{storeSlug}/order` : 주문 모드 선택(실제는 QR 토큰 필요)
   - `/{storeSlug}/order/store` : 매장 주문 샘플
   - `/{storeSlug}/order/delivery-reservation` : 배달/예약 샘플
   - `/{storeSlug}/admin` : 매장 관리자 샘플
   - `/superadmin` : 전역 관리자 샘플

> 기본 샘플 매장 슬러그는 `narae-main` 입니다.

---

## 2) Vercel에 올리기

1. GitHub에 이 폴더를 새 저장소로 업로드합니다.
2. Vercel에서 **New Project** → 방금 올린 저장소 선택.
3. **Environment Variables**(환경변수)에 `.env` 내용 그대로 입력.
4. **Deploy**를 누르면 끝!

> 배포 URL은 예: `https://qr-order-nr-a.vercel.app/` 처럼 나옵니다.

---

## 3) 관리자/전역관리자 주소
- 매장 관리자: `/admin`
- 전역 관리자: `/superadmin`

---

## 4) 자주 하는 질문
- **QR 토큰이 없는데 주문 페이지로 들어가요?**  
  현재는 샘플이므로 가이드만 보여줍니다. 실제 운영 시 미들웨어를 켜면 차단됩니다.
- **Toss 결제는 어떻게 붙이나요?**  
  `app/api/payments/*` 자리에 서버 코드가 준비되어 있고, 키만 넣고 로직을 완성하면 됩니다.

---

## 5) 다음 단계 (실서비스로 확장)
- NextAuth 도입(관리자/고객)
- Toss 결제/환불 API 완성
- Realtime 알림
- 통계(인기메뉴 Top5 차트)


---

## 6) 추가된 고급 기능

### ✅ QR 토큰(30일 만료) 자리 + 미들웨어
- `middleware.ts`에서 주문 경로 보호. (개발 모드에서는 통과)
- 실제 토큰 생성은 `lib/token.ts` 참고: `signQrToken(payload, QR_SIGNING_SECRET)`

### ✅ 결제/환불 API 자리
- `POST /api/payments/confirm` : 토스 API 호출(SECRET_KEY가 있으면 실호출, 없으면 모의 성공)
- `POST /api/payments/refund`  : 전액/부분 환불(동일 정책)

### ✅ 주문 API
- `POST /api/[storeSlug]/orders` : 주문 생성(PENDING)
- `PATCH /api/[storeSlug]/orders/:id/actions` : CONFIRM/READY/COMPLETE/CANCEL/REFUND

### ✅ 통계: 인기메뉴 TOP5
- `GET /api/[storeSlug]/stats/top5?start=YYYY-MM-DD&end=YYYY-MM-DD`

### ✅ 매장 기본정보 편집
- `PATCH /api/[storeSlug]/admin/store` : 매장명 등 수정

> Toss 키를 넣으면 즉시 실결제로 전환됩니다.


---

## 7) 새로 추가된 것 (v3)
- **QR 자동발급 API + 관리자 버튼**
  - `POST /api/[storeSlug]/admin/qr/issue` : 테이블 번호 넣고 QR 생성(PNG+토큰)
  - 관리자 콘솔 `QR 생성/다운로드` 섹션에 버튼 작동
- **주문 상세 화면**
  - `/[storeSlug]/orders/[id]` : 상태/내역 표시, 5초 간격 자동 새로고침
- **실시간 알림(소리)**
  - 관리자 `배달/예약 주문` 탭에서 새 주문이 감지되면 비프음 재생


---

## 8) v4에서 모두 연결됨 (버튼 → API)

- **매장주문/배달·예약**: 결제/예약 버튼 누르면 주문이 생성되고 **주문 상세화면으로 이동**
- **영업시간 제한**: 관리자에서 저장한 `openTime/closeTime` 범위 밖이면 주문 거절(예약 제외)
- **직원 호출**: 매장주문 화면에서 호출 전송 → 관리자 `직원 호출` 탭에서 확인/응답/완료 + 소리
- **관리자 주문 액션**: 확인/준비/완료/취소/환불 버튼이 **실제 PATCH** 호출
- **CSV 다운로드**: 관리자 주문 탭에 **CSV 다운로드** 버튼
- **오늘 주문**: `/{storeSlug}/my/today` 페이지 추가(샘플)

> 실제 서비스에선 고객/게스트 식별(guestKey, userId)에 맞춰 서버 필터를 강화하세요.


---

## 9) Toss 테스트 결제 사용법 (v5)
1) `.env`에 키 설정
```
NEXT_PUBLIC_TOSS_CLIENT_KEY=테스트_클라이언트키(test_ck_...)
TOSS_SECRET_KEY=테스트_시크릿키(test_sk_...)
```
2) 로컬 `npm run dev`로 실행 후 주문 페이지에서 **결제하기**
3) 성공 시 `/pay/success`로 이동 → 서버가 `/api/payments/confirm` 호출해 승인 처리
4) 승인 성공 시 주문 상태가 `CONFIRM`으로 업데이트

> *2시간 내 제한* 같은 타임아웃 로직은 사용하지 않았습니다.
