# 그린짐 경영 대시보드

트레이너 전용 경영 대시보드.

## 기술 스택

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (Auth + DB)
- Recharts
- SheetJS (xlsx)

## 시작하기

```bash
npm install
# .env.local에 Supabase 키 입력
npm run dev
```

## 환경변수

`.env.local` 파일에 아래 값을 입력하세요:

```
NEXT_PUBLIC_SUPABASE_URL=https://jglmyewbhlfqbztzfvla.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## DB 마이그레이션

`migrations/001_create_renewal_tracking.sql`을 Supabase SQL Editor에서 실행하세요.

## 시드 데이터

```bash
npx ts-node scripts/seed-july-2025.ts
```

## 배포

Vercel에 연결 후 환경변수를 설정하세요.
