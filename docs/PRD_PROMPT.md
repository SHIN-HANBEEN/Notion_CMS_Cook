# 메타 프롬프트: 노션 기반 견적서 웹 뷰어 MVP PRD 생성

> **사용법**: 아래 프롬프트 전문을 Claude Code에 붙여넣으면, 이 프로젝트에 맞는 MVP PRD 문서를 자동으로 생성합니다.

---

## [PROMPT START]

당신은 시니어 프로덕트 매니저이자 풀스택 개발 아키텍트입니다.
아래 프로젝트 컨텍스트와 요구사항을 읽고, 실제 개발팀이 즉시 착수할 수 있을 만큼
구체적이고 실행 가능한 **MVP PRD(Product Requirements Document)** 를 작성하세요.

---

### 프로젝트 컨텍스트

**프로젝트명**: invoice-web — 노션 연동 견적서 웹 뷰어
**목표**: 프리랜서 또는 소규모 팀이 노션(Notion)에서 견적서 데이터를 입력하면,
클라이언트가 고유 URL로 웹 페이지에서 견적서를 확인하고 PDF로 다운로드할 수 있는 서비스.

**기술 스택** (변경 불가):
- Frontend: **Next.js 16 App Router + TypeScript**
- Styling: **Tailwind CSS v4 + shadcn/ui** (스타일: radix-nova)
- Backend/BaaS: **Supabase** (PostgreSQL + Auth + Storage + Realtime)
- 상태 관리: **Zustand**
- 폼 처리: **React Hook Form + Zod**
- 아이콘: **lucide-react**
- 배포: **Vercel**
- 외부 연동: **Notion API** (공식 @notionhq/client SDK)

**코드 컨벤션**:
- 들여쓰기 2칸, 쌍따옴표, 세미콜론, trailing comma es5, 줄 폭 100자
- 모든 페이지 기본 RSC, 클라이언트 상태 필요 시만 `"use client"`
- import 경로: `@/*` (프로젝트 루트 매핑)
- 주석: 주석만 읽어도 실행 흐름과 비즈니스 로직을 완벽히 파악할 수 있도록 상세하게 작성
- 테마: 다크/라이트 모드 완전 지원 (next-themes, oklch 색상 토큰)
- 모바일 퍼스트 UI/UX, SafeArea 고려

---

### 요구사항 요약

1. **노션 → 웹 연동**: 노션 데이터베이스에 견적서 행을 추가/수정하면 웹에 실시간 반영
2. **고유 URL 공유**: 각 견적서마다 `/invoice/[id]` 형태의 공개 URL 생성
3. **웹 뷰어**: 클라이언트가 브라우저에서 견적서를 깔끔하게 확인
4. **PDF 다운로드**: 버튼 한 번으로 견적서를 PDF 파일로 저장
5. **관리자 인증**: 견적서 목록 관리 페이지는 Supabase Auth로 보호

---

### PRD 작성 지침

아래 섹션을 **순서대로, 빠짐없이** 작성하세요.
각 섹션은 개발자가 해당 섹션만 읽어도 구현 방향을 잡을 수 있어야 합니다.

#### 1. 개요 (Overview)
- 한 문단으로 제품의 핵심 가치와 MVP 범위 요약
- 대상 사용자(발행인 vs 수신 클라이언트) 구분

#### 2. 목표 및 성공 지표 (Goals & Success Metrics)
- MVP 완료 기준 3~5개 (측정 가능한 지표 포함)
- MVP 제외 범위(Out of Scope) 명시

#### 3. 사용자 스토리 (User Stories)
- 발행인(Admin) 관점 스토리 3개 이상
- 클라이언트(Viewer) 관점 스토리 3개 이상
- 각 스토리: `As a [역할], I want to [행동], so that [목적]` 형식 + 인수 조건(Acceptance Criteria) 2~3개

#### 4. 기능 명세 (Feature Specification)

##### 4-1. 노션 연동 (Notion Integration)
- 노션 데이터베이스 스키마 정의 (필드명, 타입, 필수 여부)
  - 예: 견적번호(Title), 클라이언트명(Rich Text), 발행일(Date), 만료일(Date),
    항목 목록(Relation 또는 JSON), 소계/세금/합계(Number), 상태(Select), 메모(Rich Text)
- Notion API 폴링 or Webhook 전략 선택 및 이유 설명
- Supabase에 캐싱할 데이터 모델 (테이블 DDL 수준)
- 동기화 주기 및 에러 처리 방침

##### 4-2. 견적서 URL 공유
- URL 구조: `/invoice/[invoiceId]`
- invoiceId 생성 방식 (UUID v4 또는 Notion 페이지 ID 활용)
- 공개/비공개 접근 제어 정책 (만료일 지난 견적서 처리 포함)

##### 4-3. 웹 뷰어 UI
- 페이지 레이아웃 와이어프레임 (텍스트로 ASCII 또는 마크다운 테이블로 표현)
- 필수 표시 항목: 로고, 발행인 정보, 클라이언트 정보, 견적 항목 테이블, 소계/세금/합계, 메모, 유효기간
- 반응형 브레이크포인트 기준 (모바일 / 태블릿 / 데스크탑)
- 다크모드 지원 방식

##### 4-4. PDF 다운로드
- 라이브러리 선택 및 근거: `@react-pdf/renderer` vs `puppeteer` vs `html2canvas + jsPDF` 비교 후 추천
- PDF 레이아웃이 웹 뷰어와 달라야 하는 이유 및 차이점
- 파일명 규칙 (예: `invoice-{견적번호}-{날짜}.pdf`)
- 서버사이드 생성 vs 클라이언트사이드 생성 결정 및 이유

##### 4-5. 관리자 대시보드
- 라우트 구조 (예: `/admin`, `/admin/invoices`, `/admin/invoices/[id]`)
- Supabase Auth 보호 방식 (미들웨어 vs 페이지 레벨)
- 견적서 목록 테이블 컬럼 및 필터/정렬 기능
- Notion 동기화 수동 트리거 버튼

#### 5. 데이터 모델 (Data Model)
- Supabase PostgreSQL 테이블 설계 (ERD 텍스트 표현)
- RLS(Row Level Security) 정책: 공개 견적서 조회 vs 관리자 전체 접근
- 필수 인덱스 목록

#### 6. API 설계 (API Routes)
Next.js API Routes(`app/api/`) 기준으로 작성:

| Method | Path | 설명 | Auth 필요 |
|--------|------|------|----------|
| GET | `/api/invoices/[id]` | 단일 견적서 조회 | 없음 |
| GET | `/api/admin/invoices` | 전체 목록 조회 | 있음 |
| POST | `/api/admin/sync` | Notion 동기화 트리거 | 있음 |
| GET | `/api/invoices/[id]/pdf` | PDF 생성 및 반환 | 없음 |

각 엔드포인트에 요청/응답 스키마(TypeScript 인터페이스) 명시

#### 7. 디렉토리 구조 (Directory Structure)
이 프로젝트의 기존 구조를 확장하는 형태로 새로 추가될 파일/폴더 목록 제안:

```
app/
  invoice/[id]/         # 공개 견적서 뷰어 페이지
  admin/                # 관리자 영역
    layout.tsx          # Auth 가드
    invoices/
api/
  invoices/[id]/
  admin/
components/
  invoice/              # 견적서 전용 컴포넌트
lib/
  notion.ts             # Notion API 클라이언트
  invoice.ts            # 견적서 도메인 로직
types/
  invoice.ts            # 공유 TypeScript 타입
```

#### 8. 구현 우선순위 및 마일스톤 (Milestones)
- Phase 1 (핵심 동작): 어떤 기능을 먼저 구현해야 하는가
- Phase 2 (완성도): 이후 추가할 기능
- 각 Phase별 완료 정의(Definition of Done)

#### 9. 기술적 고려사항 및 리스크 (Technical Considerations)
- Notion API Rate Limit 대응 전략
- PDF 생성 서버 부하 및 캐싱 방안
- 견적서 데이터 보안 (민감 정보 노출 방지)
- Vercel Edge / Serverless 환경 제약 (예: puppeteer 사용 불가)

#### 10. 환경 변수 목록 (Environment Variables)
MVP에 필요한 모든 환경 변수를 `.env.local` 형식으로 나열하고, 각 변수의 용도 주석 추가

---

### 출력 형식 지침

- 전체 문서를 **하나의 마크다운 파일**로 출력하세요.
- 저장 경로: `docs/PRD.md`
- 헤딩 레벨: H1(문서 제목), H2(섹션), H3(서브섹션)
- 코드 블록은 언어 태그 명시 (` ```typescript `, ` ```sql `, ` ```bash ` 등)
- 테이블은 GitHub Flavored Markdown 형식
- 각 섹션 말미에 **구현 시 주의사항** 박스(`> **주의**:`) 추가
- 분량: 최소 300줄 이상, 개발팀이 외부 문서 없이 착수 가능한 수준

---

### 최종 체크리스트

PRD 작성 완료 후 아래 항목을 스스로 검토하고, 누락된 항목이 있으면 보완하세요:

- [ ] Notion 데이터베이스 스키마가 견적서의 모든 필수 필드를 포함하는가?
- [ ] PDF 라이브러리 선택에 Vercel Serverless 제약이 반영되었는가?
- [ ] RLS 정책이 공개 URL과 관리자 접근을 올바르게 분리하는가?
- [ ] 모든 API Route에 에러 응답 형식이 정의되었는가?
- [ ] 환경 변수 목록이 완전한가?
- [ ] 마일스톤이 독립적으로 배포 가능한 단위로 나뉘어 있는가?

## [PROMPT END]
