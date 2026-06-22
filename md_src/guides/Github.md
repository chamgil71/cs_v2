---
title: "코드를 함께 만들고,함께 관리하는 GitHub"
subtitle: "버전 관리와 협업"
badge: "🐙 세계 최대 코드 협업 플랫폼"
style: "webdev"
stats:
  - value: "무료"
    label: "Public 저장소"
  - value: "1억+"
    label: "개발자 사용"
  - value: "Copilot"
    label: "AI 코딩 어시스턴트"
  - value: "Actions"
    label: "CI/CD 자동화"
---

# Git 핵심 개념과 기본 명령어

Git은 코드 변경 이력을 관리하는 분산 버전 관리 시스템입니다.

::: cmd-box
- title: "명령어"
  tag: "bash"
  desc: "git init"
:::

### 브랜치 전략 (Git step-flow)

::: workflow-flow
- title: |
    main
     
     v1.0
     
     v1.1
     
     v2.0
     
     
     
     
     
     develop
     
     
     
     
     
     
     
     
     
     
     
     feature
- title: |
    main
     
     v1.0
     
     v1.1
     
     v2.0
- title: "develop"
- title: "feature"
:::

# GitHub 핵심 기능

코드 협업과 개발 자동화를 위한 강력한 도구들입니다.

::: feature-grid cols=3
- title: "Pull Request (PR)"
  tag: "협업 필수"
  desc: "변경 사항을 코드 리뷰를 거쳐 병합하는 협업 워크플로우. 코드 품질 유지의 핵심입니다."
- title: "Issues"
  tag: "프로젝트 관리"
  desc: "버그 리포트, 기능 요청, 할 일 관리를 위한 이슈 트래커. 라벨, 마일스톤, 담당자 지정 가능."
- title: "GitHub Actions"
  tag: "자동화"
  desc: "코드 푸시, PR 등의 이벤트에 자동으로 빌드·테스트·배포를 실행하는 CI/CD 자동화 도구."
- title: "GitHub Copilot"
  tag: "AI 코딩"
  desc: "AI 기반 코드 자동완성 도구. 주석을 작성하면 코드를 제안하고, 전체 함수도 생성합니다."
- title: "Packages"
  tag: "패키지 관리"
  desc: "npm, Docker, Maven 등의 패키지를 GitHub 내에서 바로 배포하고 관리합니다."
- title: "GitHub Pages"
  tag: "무료 호스팅"
  desc: "저장소에서 직접 정적 웹사이트를 무료로 호스팅합니다. 포트폴리오, 문서 사이트에 최적."
:::

# GitHub Actions — CI/CD 자동화

코드를 푸시하면 자동으로 테스트하고 배포하는 파이프라인을 구성합니다.

::: workflow-flow
- icon: "💾"
  title: "코드 Push"
  desc: "개발자가 GitHub에 코드 업로드"
- title: "→"
- icon: "🔧"
  title: "Build"
  desc: "빌드 환경 설정 및 의존성 설치"
- title: "→"
- icon: "🧪"
  title: "Test"
  desc: "자동 테스트 실행 및 결과 확인"
- title: "→"
- icon: "🚀"
  title: "Deploy"
  desc: "서버 또는 클라우드에 자동 배포"
:::

::: cmd-box
- title: "명령어"
  tag: "bash"
  desc: |
    .github/workflows/ci.yml
     
    
     
     name: CI Pipeline
    
     on: [push, pull_request]
    
     jobs:
    
     test:
    
     runs-on: ubuntu-latest
    
     steps:
    
     - uses: actions/checkout@v4
    
     - name: Run Tests
    
     run: npm test
:::

# GitHub 웹 단축키

? 키를 누르면 현재 페이지의 모든 단축키를 볼 수 있습니다.

| 기능 | 단축키 | 설명 |
| --- | --- | --- |
| 파일 검색 | T | 저장소 내 파일 검색 |
| 전체 검색 | / | 검색창 포커스 |
| 커맨드 팔레트 | Ctrl+K | 빠른 명령 실행 |
| 새 이슈 | C | 이슈 목록에서 새 이슈 생성 |
| 이슈 할당 | A | 이슈/PR에서 담당자 지정 |
| 라벨 지정 | L | 이슈/PR에서 라벨 지정 |
| 코드 블록 하이라이트 | 줄 번호 클릭 후 Shift+클릭 | 여러 줄 선택 후 공유 |
| PR 수정 없이 merge | Ctrl+Enter | PR 코멘트 제출 |

# 실전 GitHub 활용 팁

개발 효율을 높이는 GitHub 노하우입니다.

🤖 GitHub Copilot + Claude Code 조합

VS Code에서 GitHub Copilot으로 인라인 코드 완성, 터미널에서 Claude Code로 복잡한 리팩토링. 두 AI를 역할에 맞게 사용하면 생산성이 극대화됩니다.

📝 커밋 메시지 컨벤션

feat: 새 기능 | fix: 버그 수정 | docs: 문서 | style: 포맷 | refactor: 리팩토링 | test: 테스트. 이 규칙으로 커밋 히스토리가 깔끔해집니다.

🔒 .gitignore 꼭 설정하기

API 키, 환경변수(.env), node_modules, __pycache__ 등은 절대 커밋하면 안 됩니다. gitignore.io에서 자신의 스택에 맞는 .gitignore를 자동 생성하세요.

⭐ GitHub Stars & Trending

github.com/trending에서 매일 인기 오픈소스 프로젝트를 확인하세요. 좋은 코드를 읽는 것이 최고의 학습입니다.

## 🐙 코드를 세상과 공유하세요

첫 저장소를 만들고, 첫 커밋을 남겨보세요.

🐙 GitHub 시작하기
