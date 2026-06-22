---
title: "코딩의 표준,Visual Studio Code"
subtitle: "코드 에디터 완전 정복"
badge: "💻 세계 1위 코드 에디터"
style: "ai-dev"
stats:
  - value: "완전 무료"
    label: "오픈소스"
  - value: "1위"
    label: "개발자 에디터"
  - value: "30,000+"
    label: "확장 프로그램"
  - value: "Win/Mac/Linux"
    label: "크로스 플랫폼"
---

# VS Code 에디터 살펴보기

신택스 하이라이팅, IntelliSense, 멀티 커서 편집 등 강력한 편집 기능을 갖추고 있습니다.

::: editor-box
- title: "app.py"
  tag: "app.py"
  desc: |
    # AI 활용 데이터 분석 예시
    
     import pandas as pd
    
     from anthropic import Anthropic
    
     
    
     client = Anthropic()
    
     
    
     def analyze_data(df: pd.DataFrame) -> str:
    
     """데이터프레임을 분석하여 인사이트를 반환합니다"""
    
     summary = df.describe().to_string()
    
     response = client.messages.create(
    
     model="claude-opus-4-5",
    
     messages=[{"role": "user", "content": summary}]
:::

# 필수 확장 프로그램

Ctrl+Shift+X (Extensions) 에서 설치할 수 있습니다.

::: icon-grid
- icon: "🤖"
  title: "GitHub Copilot"
  tag: "AI 필수"
  desc: "AI 코드 자동완성. 주석 작성 시 코드를 제안합니다. 학생/교사 무료."
- icon: "🐍"
  title: "Python (ms-python)"
  tag: "언어"
  desc: "파이썬 개발 필수. 린팅, 디버깅, Jupyter 지원 등 통합 제공."
- icon: "🦊"
  title: "GitLens"
  tag: "Git"
  desc: "Git 히스토리, blame 정보, 변경 비교를 에디터 내에서 바로 볼 수 있습니다."
- icon: "🎨"
  title: "Prettier"
  tag: "포맷터"
  desc: "코드 자동 포맷터. JS/TS/Python/HTML/CSS 등 저장 시 자동 정리."
- icon: "🌈"
  title: "One Dark Pro"
  tag: "테마"
  desc: "가장 인기 있는 다크 테마. 눈이 편한 색상으로 장시간 코딩에 최적."
- icon: "🔍"
  title: "ESLint"
  tag: "JS/TS"
  desc: "자바스크립트/타입스크립트 코드 오류와 스타일 문제를 실시간 감지합니다."
- icon: "🗂️"
  title: "Material Icon Theme"
  tag: "UI"
  desc: "파일 탐색기의 파일 아이콘을 직관적으로 변경합니다. 파일 종류 파악이 쉬워집니다."
- icon: "🌐"
  title: "Live Server"
  tag: "웹"
  desc: "HTML 파일을 저장하면 브라우저가 자동으로 새로고침됩니다. 웹 개발 필수."
:::

# VS Code의 AI 코딩 도구

GitHub Copilot과 Claude Code의 조합으로 최강의 AI 개발 환경을 구성하세요.

### 🤖 AI 개발 도구 조합

#### GitHub Copilot

인라인 코드 자동완성. 탭 한 번으로 코드 블록 완성. Copilot Chat으로 코드 설명 요청.

#### Claude Code (터미널)

VS Code 통합 터미널에서 claude 명령으로 복잡한 리팩토링, 전체 파일 분석, 버그 수정.

#### Continue (확장)

Claude, GPT-4 등 다양한 AI를 VS Code에서 직접 연결. 무료로 사용 가능한 Copilot 대안.

#### Codeium (확장)

완전 무료 AI 코드 완성 도구. Copilot 없이도 AI 자동완성 기능을 사용할 수 있습니다.

# 필수 단축키

이 단축키들만 익혀도 코딩 속도가 2배 이상 빨라집니다.

⚡ 편집

커맨드 팔레트

Ctrl

Shift

P

빠른 파일 열기

Ctrl

P

멀티커서 (같은 단어)

Ctrl

D

줄 이동

Alt

↑↓

줄 복사

Shift

Alt

↓

줄 삭제

Ctrl

Shift

K

🔍 탐색

전체 검색

Ctrl

Shift

F

파일 내 검색

Ctrl

F

찾아 바꾸기

Ctrl

H

심볼로 이동

Ctrl

Shift

O

특정 줄로 이동

Ctrl

G

에디터 분할

Ctrl

\

🖥️ 터미널 & 뷰

통합 터미널 토글

Ctrl

`

새 터미널

Ctrl

Shift

`

사이드바 토글

Ctrl

B

탐색기 열기

Ctrl

Shift

E

확장 관리

Ctrl

Shift

X

전체 화면

F11

# VS Code 실전 팁

생산성을 극대화하는 VS Code 노하우입니다.

⚙️ settings.json 필수 설정

"editor.formatOnSave": true (저장 시 자동 포맷), "editor.fontSize": 14, "editor.minimap.enabled": false (미니맵 끄기로 더 넓은 화면), "terminal.integrated.defaultProfile.windows": "Git Bash"

🔄 멀티 루트 워크스페이스

File → Add Folder to Workspace로 여러 프로젝트 폴더를 하나의 VS Code 창에서 관리합니다. 프론트엔드/백엔드 동시 작업에 유용합니다.

🤖 Claude Code + VS Code 최강 조합

VS Code 통합 터미널에서 claude를 실행하면 현재 열린 프로젝트 폴더 전체를 Claude가 분석하고 수정할 수 있습니다. 복잡한 리팩토링이나 버그 수정에 최적입니다.

🌐 Dev Containers

Docker를 사용해 개발 환경을 컨테이너화합니다. 팀원 모두 동일한 환경에서 작업할 수 있어 "내 컴퓨터에서는 잘 되는데…" 문제가 사라집니다.

## 💻 코딩의 세계로 오신 것을 환영합니다

VS Code를 설치하고, 첫 번째 프로젝트를 시작해보세요.

💻 VS Code 다운로드
