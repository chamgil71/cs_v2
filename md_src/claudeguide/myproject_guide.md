---
title: "내 프로젝트 운영 가이드"
subtitle: "c:\\ai\\ 하위 11개 프로젝트 현황 및 운영 참조"
badge: "2026-06 기준"
style: "ai-dev"
logo: "🛠️"
fontFace: "Malgun Gothic"
titleSize: 22
bodySize: 12
stats:
  - value: "11개"
    label: "운영 프로젝트"
  - value: "3개"
    label: "Vercel 배포"
  - value: "7종"
    label: "GitHub 저장소"
  - value: "Python"
    label: "주력 언어"
done:
  title: "🛠️ 프로젝트 운영 가이드 완성!"
  subtitle: "웹 서비스, AI 자동화, 데이터 엔진, 엔터프라이즈 솔루션, 콘텐츠 빌더까지 — c:\\ai\\ 전체 프로젝트를 한 곳에서 파악하세요."
  ctaLabel: "GitHub 프로필"
  ctaUrl: "https://github.com/chamgil71"
---

# 1. 프로젝트 전체 맵

11개 운영 프로젝트를 도메인별로 분류하고 스택·배포 현황을 한눈에 정리.

---

## 도메인별 분류

::: feature-grid cols=3
- icon: "🌐"
  title: "웹 서비스 & 대시보드"
  tag: "3개"
  desc: "배포된 정적·풀스택 웹 서비스"
  meta: "pjtoverview — R&D 과제 관리 (Vercel)|mywiki — 개인 지식 창고 (Vercel + Pages)|clearsurvey — 설문 정제 대시보드 (로컬)"
  color: "#6366F1"
- icon: "🤖"
  title: "AI 자동화 파이프라인"
  tag: "2개"
  desc: "스케줄·이벤트 기반 자동 발행 시스템"
  meta: "dailynews — 뉴스 3채널 자동 브리핑 (Vercel)|weeklyreport — 주간보고서 취합·발행 (로컬)"
  color: "#10A37F"
- icon: "⚙️"
  title: "데이터 처리 엔진"
  tag: "2개"
  desc: "대용량 파일 파이프라인 및 분석 도구"
  meta: "BudgetN — 예산 7단계 파이프라인 (Pages)|doc-analysis — 기밀문서 분석 (로컬 전용)"
  color: "#F59E0B"
- icon: "🏢"
  title: "엔터프라이즈 솔루션"
  tag: "3개"
  desc: "기업 내부 업무 자동화 솔루션 묶음"
  meta: "companypool — 기업 마스터 DB ETL|convertertools — 문서 형식 변환 엔진|filetools — 파일 관리·무결성 검증"
  color: "#8B5CF6"
- icon: "✨"
  title: "콘텐츠 빌더"
  tag: "1개"
  desc: "MD → HTML 슬라이드 / PPTX 변환 엔진"
  meta: "creative-spark — 29종 shortcode 시스템"
  color: "#D97757"
:::

---

## 배포 & 저장소 현황

::: git-flow
- title: "pjtoverview"
  tag: "Vercel 배포"
  meta: "https://pjtoverview.vercel.app|github.com/chamgil71/pjtoverview"
  color: "#6366F1"
- title: "mywiki"
  tag: "Vercel + GitHub Pages"
  meta: "https://mywiki-khaki.vercel.app|github.com/chamgil71/mywiki"
  color: "#8B5CF6"
- title: "dailynews"
  tag: "Vercel 배포"
  meta: "https://ms-dailynews.vercel.app|github.com/chamgil71/dailynews"
  color: "#10A37F"
- title: "BudgetN"
  tag: "GitHub Pages"
  meta: "Actions 자동 배포 (main push)|github.com/chamgil71/BudgetN"
  color: "#F59E0B"
- title: "companytools"
  tag: "로컬 운영"
  meta: "github.com/chamgil71/companytools|companypool · convertertools · filetools 포함"
  color: "#D97757"
:::

---

# 2. 웹 서비스 & 대시보드

---

## pjtoverview — R&D 과제 통합 관리

XLSX 4개 시트 → Python 7단계 파이프라인 → JSON → React 대시보드 → Vercel 정적 배포.

::: tool-list
- icon: "📊"
  title: "KPI 대시보드"
  desc: "KPI 카드 5종, 연도별 트렌드, 본부별·재원별 차트"
  meta: "멀티 필터 AND/OR 검색|슬라이드 패널 과제 상세|협약 리스트"
  color: "#6366F1"
- icon: "🔬"
  title: "분석 기능"
  desc: "과제명 TF-IDF 유사도 교차 분석, 3-way 비교 팝업"
  meta: "예산 3자 교차 검증 (사업총괄/과제총괄/수행기관)|기업 연도별 참여 이력 조회|Supabase 이메일 로그인"
  color: "#4F46E5"
:::

::: step-list
- title: "1 파이프라인 실행"
  desc: "python pipeline/cli.py --input storage/input.xlsx"
  color: "#6366F1"
- title: "2 프론트엔드"
  desc: "cd frontend && npm run dev"
  color: "#8B5CF6"
- title: "3 배포"
  desc: "npm run build → Vercel 자동 배포"
  color: "#A78BFA"
:::

---

## mywiki — 개인 지식 창고

Obsidian 노트 중 `publish: true` 표시된 것만 Quartz v4로 빌드해 Vercel · GitHub Pages에 이중 배포.

::: compare-grid cols=2
- title: "Vercel (주 서비스)"
  desc: "mywiki-khaki.vercel.app"
  meta: "GitHub 연동 자동 배포|글로벌 CDN 빠른 응답"
  color: "#000000"
- title: "GitHub Pages (백업)"
  desc: "chamgil71.github.io/mywiki"
  meta: "GitHub Actions → deploy.yaml|main push 시 자동 빌드"
  color: "#1F2937"
:::

::: step-list
- title: "노트 작성"
  desc: "Obsidian에서 작성 후 publish: true 설정"
  color: "#7C3AED"
- title: "로컬 미리보기"
  desc: "npx quartz build --serve"
  color: "#8B5CF6"
- title: "배포"
  desc: "git push → GitHub Actions 자동 빌드 & 배포"
  color: "#A78BFA"
:::

::: summary-box
- title: "주요 설정 파일"
  desc: "quartz.config.ts — 사이트 제목·테마·플러그인 / quartz.layout.ts — 레이아웃 구성 / index_md.py — 노트 인덱스 자동 생성"
  meta: "content/ 폴더에 마크다운 노트 보관|deploy.ps1로 Vercel 수동 배포 가능"
:::

---

## clearsurvey — 설문 데이터 정제 & 대시보드

설문·행정 원본 XLSX를 1-Click으로 정밀 정제하고 엑셀 요약 보고서와 React 대시보드로 발행하는 풀스택 플랫폼.

::: compare-grid cols=2
- title: "정적 모드"
  desc: "백엔드 없이 demo JSON으로 차트·PDF/CSV 기능 동작. GitHub Pages 환경에서도 서비스 가능."
  meta: "설치 없이 즉시 사용|Donut · Bar · Histogram 차트|PDF/CSV 다운로드"
  color: "#6366F1"
- title: "풀스택 모드"
  desc: "FastAPI 연동으로 파일 업로드·10열 컬럼 매핑·실시간 정제 파이프라인 트리거."
  meta: "SSE 실시간 로그 스트리밍|SurveyPipeline 1-Click 실행|openpyxl Slicer 패치 엑셀 보고서"
  color: "#10A37F"
:::

::: step-list
- title: "백엔드 실행"
  desc: "pip install -r requirements.txt && python main.py"
  color: "#6366F1"
- title: "프론트엔드"
  desc: "cd web && npm run dev"
  color: "#8B5CF6"
- title: "프로젝트 설정"
  desc: "config/config.yaml — 컬럼 매핑·변환 규칙(20여 종) 정의"
  color: "#A78BFA"
:::

---

# 3. AI 자동화 파이프라인

---

## dailynews — AI 뉴스 자동 브리핑

RSS 수집 → Gemini/Claude 분석 → 웹 + 이메일 + 텔레그램 + 카드뉴스를 **완전 자동** 발행하는 서버리스 3채널 시스템.

::: stat-grid cols=3
- icon: "📰"
  title: "뉴스 채널"
  desc: "KST 03:15 수집 → 즉시 배포·발송"
- icon: "📊"
  title: "주식 채널"
  desc: "21:25 수집 → 23:00 빌드 → 익일 08:00 발송"
- icon: "🤖"
  title: "AI이슈 채널"
  desc: "매주 일 07:00 수집 → 즉시 배포·발송"
:::

::: git-flow
- title: "GitHub Actions 수집"
  tag: "스케줄 트리거"
  meta: "news.yml / stock_build.yml / ai_issue.yml|7개 워크플로우로 채널별 독립 운영"
  color: "#1F2937"
- title: "Gemini / Claude 분석"
  tag: "AI 처리"
  meta: "RSS 원문 → 요약·분류·인사이트 추출|scripts/run_news.py · build_site.py"
  color: "#10A37F"
- title: "Vercel 배포"
  tag: "ms-dailynews.vercel.app"
  meta: "HTML 정적 빌드 → Vercel CLI push"
  color: "#000000"
- title: "이메일 + 텔레그램"
  tag: "Resend API 발송"
  meta: "send_email.py --type news|stock|ai-issue|send_telegram.py 동일 인터페이스"
  color: "#6366F1"
:::

---

## weeklyreport — 주간보고서 자동화

팀원이 YAML 파일에 업무를 기록하면 취합·검증·발행·누적 관리까지 자동 처리하는 WRMS v3.2.

::: feature-grid cols=2
- icon: "📥"
  title: "YAML 입력"
  desc: "reports/yymmdd/팀명.yaml 형식으로 팀별 분리 입력"
- icon: "✅"
  title: "자동 검증"
  desc: "dryrun.py로 오류 사전 점검 후 취합 실행"
- icon: "📤"
  title: "다중 출력"
  desc: "HTML / Excel / PDF / DOCX 동시 내보내기"
- icon: "📈"
  title: "누적 관리"
  desc: "누적관리.xlsx — 매주 시트 자동 추가 (히스토리 보존)"
:::

::: step-list
- title: "dryrun (검증)"
  desc: "python wrms.py --dryrun --date 260613"
  color: "#10A37F"
- title: "취합 & 출력"
  desc: "python wrms.py --date 260613"
  color: "#059669"
- title: "GUI 실행"
  desc: "python wrms.py --gui"
  color: "#047857"
:::

---

# 4. 데이터 처리 엔진

---

## BudgetN — 정부 예산 7단계 파이프라인

PDF·XLSX·YAML 등 다양한 포맷의 정부 예산 자료를 단일 canonical JSON으로 통합하고 TF-IDF 유사도 분석 후 GitHub Pages로 자동 배포.

::: workflow-flow
- icon: "📥"
  title: "수집"
  meta: "PDF · XLSX(총괄/A4) · YAML · JSON 멀티 포맷"
- icon: "→"
- icon: "🔀"
  title: "통합"
  meta: "단일 canonical schema (merged.json) 수렴"
- icon: "→"
- icon: "📐"
  title: "정규화"
  meta: "법인명·날짜·금액 표준화"
- icon: "→"
- icon: "🔬"
  title: "분석"
  meta: "TF-IDF + Cosine + Jaccard 유사도"
- icon: "→"
- icon: "📦"
  title: "번들링"
  meta: "embedded-*.js 오프라인 Fallback"
- icon: "→"
- icon: "🚀"
  title: "배포"
  meta: "GitHub Actions → GitHub Pages 자동"
:::

::: summary-box
- title: "핵심 실행 명령"
  desc: "python backend/master_builder.py — 전체 7단계 한 번에 실행 / python backend/master_builder.py --step 4 — 특정 단계만 부분 실행"
  meta: "config/config.yaml 컬럼 매핑만 수정하면 코드 변경 불필요|cd web && npm run dev — 로컬 대시보드 확인"
:::

---

## doc-analysis — 기밀문서 분석

내부 기밀문서(HWP·PDF·XLSX·PPTX 등)를 마크다운으로 변환하고 유사도 분석·사업별 분할·통계 통합을 수행하는 **완전 로컬** 분석 환경.

::: feature-grid cols=3
- icon: "🔒"
  title: "보안 원칙"
  tag: "절대 준수"
  desc: "외부 API·클라우드 서비스 전송 금지. web_search, Notion MCP 사용 금지."
- icon: "🔄"
  title: "변환"
  desc: "convert_to_md.py — 전 포맷 고속 변환 (pymupdf) / pdf_to_md.py — 표 구조 정밀 보존 (pdfplumber)"
- icon: "✂️"
  title: "분할"
  desc: "split_by_project.py — 사업명 기준 MD 자동 분할"
- icon: "📊"
  title: "유사도 분석"
  desc: "similarity_analysis.py — TF-IDF / Jaccard 교차 분석 → Excel"
- icon: "📈"
  title: "통계 통합"
  desc: "stats_merger.py — 연도별 통계 통합 → Excel"
- icon: "🗂️"
  title: "파일 분류"
  desc: "file_classifier.py — 키워드 기반 자동 분류"
:::

::: step-list
- title: "원본 배치"
  desc: "raw_docs/ 폴더에 기밀 파일 배치 또는 Junction 링크 연결"
  color: "#F59E0B"
- title: "변환"
  desc: "python scripts/convert_to_md.py --input raw_docs/ --output md_docs/"
  color: "#D97757"
- title: "분할 → 분석"
  desc: "python scripts/split_by_project.py && python scripts/similarity_analysis.py"
  color: "#B45309"
:::

---

# 5. 엔터프라이즈 솔루션 (company)

`c:\ai\company\` 하위 기업 내부 업무용 솔루션 3종. 모두 **4-Layer 아키텍처** 공통 준수.

---

## company 워크스페이스 3종

::: tool-list
- icon: "🏷️"
  title: "companypool — 기업 마스터 DB"
  desc: "다양한 출처의 기업 정보 Excel을 정규화된 마스터 DB(JSON)로 통합하는 ETL 도구"
  meta: "python main.py sync -i storage/input.xlsx → output.json + result.xlsx|config.yaml 컬럼 매핑·패턴 정의|변경이력 자동 기록"
  color: "#8B5CF6"
- icon: "🔀"
  title: "convertertools — 문서 변환 엔진"
  desc: "HWP·HWPX·PDF·Word·PPT·Excel을 포맷 독립 중간 표현형(IRBlock) 경유로 자유 변환"
  meta: "지원: HWPX·HWP·DOCX·PPTX·XLSX·PDF·MD|python convert_to_md.py --input doc.hwpx --output doc.md|python gui/app.py — GUI 실행"
  color: "#7C3AED"
- icon: "📁"
  title: "filetools — 파일 관리·무결성"
  desc: "대용량 파일 고속 복사·해시 기반 무결성 검증·매니페스트 기반 일괄 작업 파이프라인"
  meta: "액션: Keep / Rename / Move / Copy / Unzip / PDF_Convert|streamlit run frontend/app.py — 웹 UI|python backend/pipeline.py --manifest storage/manifest.xlsx"
  color: "#6D28D9"
:::

::: summary-box
- title: "4-Layer 아키텍처 공통 규칙"
  desc: "backend/(api·service·repository·models) → frontend/ → storage/ → docs/ 구조를 3개 솔루션 모두 준수."
  meta: "Router에 비즈니스 로직 금지|모든 파일 경로는 pathlib.Path 사용|환경변수는 .env + config.yaml 분리"
:::

---

# 6. creative-spark — 콘텐츠 빌더

마크다운 + 29종 shortcode로 작성한 문서를 React 웹북 / 횡스크롤 슬라이드 HTML / PPTX로 동시 출력하는 빌드 엔진.

---

## 3가지 출력 형식

::: stat-grid cols=3
- icon: "📖"
  title: "가이드 HTML"
  desc: "node scripts/build-guide.mjs <파일> → public/<폴더>/<파일>.html"
- icon: "🎞️"
  title: "횡 슬라이드"
  desc: "node scripts/build-presentation.mjs <파일> → public/presentation/<파일>.html"
- icon: "📊"
  title: "PPTX"
  desc: "node scripts/build-pptx.mjs <파일> → public/pptx/<파일>.pptx"
:::

---

## 29종 shortcode & 스타일 시스템

::: feature-grid cols=2
- icon: "🧩"
  title: "레이아웃 & 목록"
  desc: "feature-grid, icon-grid, compare-grid, stat-grid, tool-list, level-grid, plan-grid, columns-grid"
- icon: "🔀"
  title: "흐름 & 코드"
  desc: "step-list, step-flow, git-flow, workflow-flow, editor-box, cmd-box, console-box"
- icon: "🎨"
  title: "스타일 프리셋"
  desc: "ai-chat(그린) · ai-dev(오렌지) · knowledge(퍼플) · dark-pro(다크) 등 10종"
- icon: "📁"
  title: "소스 위치"
  desc: "md_src/claudeguide/ — AI 도구·프로젝트 가이드 / config/styles.json — 스타일 설정"
:::

::: step-list
- title: "단일 파일 빌드"
  desc: "node scripts/build-guide.mjs md_src/claudeguide/ai-tools-guide.md"
  color: "#D97757"
- title: "슬라이드 빌드"
  desc: "node scripts/build-presentation.mjs md_src/claudeguide/myproject_guide.md"
  color: "#B45309"
- title: "전체 빌드"
  desc: "npm run build:all — dist/ + public/ 동시 생성"
  color: "#92400E"
:::

---

# 7. 공통 인프라 & 운영

---

## GitHub Actions 공통 패턴

dailynews(7개), BudgetN, pjtoverview에서 공통으로 쓰는 워크플로우 구조.

::: feature-grid cols=2
- icon: "⏰"
  title: "스케줄 & 수동 트리거"
  desc: "on: schedule(cron: KST 보정) + workflow_dispatch 항상 포함"
- icon: "🔐"
  title: "Secrets 관리"
  desc: "API 키는 GitHub Repository Secrets에 저장. 코드 하드코딩 절대 금지. 로컬은 .env 파일 사용"
- icon: "🐍"
  title: "Python 빌드"
  desc: "actions/setup-python@v5 → pip install → python scripts/run.py"
- icon: "🚀"
  title: "GitHub Pages 배포"
  desc: "peaceiris/actions-gh-pages@v4 → gh-pages 브랜치 자동 push"
:::

---

## 프로젝트 간 데이터 흐름

::: git-flow
- title: "원본 데이터"
  tag: "입력"
  meta: "doc-analysis: 기밀 HWP·PDF·XLSX → MD|companypool: 기업 Excel → output.json|BudgetN: 예산 PDF/XLSX → merged.json"
  color: "#6B7280"
- title: "정제 & 분석"
  tag: "처리"
  meta: "pjtoverview: R&D XLSX → JSON → 대시보드|clearsurvey: 설문 XLSX → 정제 → 대시보드|weeklyreport: YAML → 취합 → Excel/HTML"
  color: "#F59E0B"
- title: "콘텐츠 & 발행"
  tag: "출력"
  meta: "creative-spark: MD → HTML슬라이드 / PPTX|mywiki: Obsidian 노트 → Quartz → Vercel|dailynews: RSS → AI → 웹+이메일+텔레그램"
  color: "#10A37F"
:::

::: summary-box
- title: "Vercel 공통 설정 (pjtoverview · mywiki · dailynews)"
  desc: "buildCommand: npm run build / outputDirectory: dist / rewrites: SPA fallback (/* → /index.html)"
  meta: "GitHub 연동으로 main push 시 자동 배포|프리뷰 URL은 PR마다 자동 생성"
:::
