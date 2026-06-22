---
title: "클로드 코드설치 가이드"
subtitle: "클로드 코드 설치 가이드"
badge: "🎉 완전 초보자 맞춤 가이드"
style: "ai-dev"
stats:
  - value: "약 10분"
    label: "설치 소요 시간"
  - value: "3가지"
    label: "운영체제 지원"
  - value: "무료"
    label: "Node.js 설치"
---

::: feature-grid cols=3
- icon: "💡"
  title: |
    💡
     클로드 코드란?Step 1
- icon: "📋"
  title: |
    📋
     준비물 확인Step 2
- icon: "⚙️"
  title: |
    ⚙️
     설치하기Step 3
- icon: "🚀"
  title: |
    🚀
     첫 번째 실행Step 4
- icon: "🔧"
  title: |
    🔧
     문제 해결Step 5
- icon: "❓"
  title: |
    ❓
     자주 묻는 질문FAQ
:::

# 클로드 코드란 무엇인가요?

설치하기 전에 클로드 코드가 어떤 도구인지 간단히 알아봐요!

::: icon-grid
- icon: "💬"
  title: "말로 하는 코딩 도우미"
  desc: "\"이 코드가 왜 오류가 나요?\" 처럼 우리말로 물어보면 AI가 답해줍니다."
- icon: "📁"
  title: "내 컴퓨터 파일과 직접 연결"
  desc: "인터넷 창에 붙여넣기 할 필요 없이, 내 컴퓨터 파일을 직접 분석합니다."
- icon: "⚡"
  title: "터미널(명령 창)에서 동작"
  desc: "검은 화면의 터미널에서 실행하지만, 사용 방법은 매우 간단합니다!"
- icon: "🔄"
  title: "Claude.ai 와는 다른 도구"
  desc: "claude.ai(웹사이트)와 별개로 설치해서 쓰는 전문 개발자 도구입니다."
:::

$

claude

✻ Claude Code 2.x.x 에 오신 걸 환영합니다!

/help 로 사용법을 확인하세요.

›

이 파일에서 버그를 찾아줘

⦿ app.py 파일을 분석하고 있습니다...

⦿ 17번째 줄에서 오류를 발견했습니다.

→ `None` 값에 대한 예외 처리가 필요합니다.

›

# 설치 전 준비물을 확인해요

아래 항목들을 미리 준비하시면 설치가 훨씬 매끄럽게 진행됩니다.

::: feature-grid cols=3
- icon: "💻"
  title: "지원 운영체제"
  tag: "필수 확인"
  desc: "Windows, macOS(맥), Linux 모두 지원됩니다. 본인의 운영체제에 맞는 설치 방법을 선택해 주세요."
- icon: "🟢"
  title: "Node.js (버전 18 이상)"
  tag: "필수 설치"
  desc: "클로드 코드가 동작하려면 Node.js가 필요합니다. 아직 없다면 설치 과정에서 함께 안내해 드려요."
- icon: "🔑"
  title: "Anthropic 계정"
  tag: "필수"
  desc: "claude.ai 계정이 있으면 됩니다. Claude Pro ($20/월) 이상 구독 또는 API 키가 필요합니다."
- icon: "📶"
  title: "인터넷 연결"
  tag: "필수"
  desc: "설치 중 파일 다운로드 및 인증에 인터넷이 필요합니다. 안정적인 Wi-Fi 환경을 권장합니다."
- icon: "⚡"
  title: "관리자 권한"
  tag: "경우에 따라"
  desc: "설치 시 컴퓨터 관리자 비밀번호를 묻는 경우가 있을 수 있습니다. 미리 비밀번호를 확인해 두세요."
- icon: "🐙"
  title: "Git (선택)"
  tag: "권장 사항"
  desc: "코드 버전 관리를 위한 Git이 있으면 더 편리합니다. Windows 사용자는 Git for Windows를 권장합니다."
:::

::: alert-box tip
- title: "Node.js가 뭔가요?"
  desc: |
    💡
    
     
     
     JavaScript 프로그래밍 언어를 컴퓨터에서 직접 실행할 수 있게 해주는 도구입니다. 클로드 코드 내부적으로 이것을 사용하기 때문에 미리 설치되어 있어야 합니다. 마치 한글 문서를 열기 위해 '한글(HWP)' 프로그램이 필요한 것과 같아요!
:::

# 본인의 운영체제를 선택해 주세요

사용하시는 컴퓨터 종류에 맞는 탭을 눌러주세요. 각 탭마다 맞춤 설치 방법을 안내해 드립니다.

::: os-tabs
- title: "macOS (맥)"
- title: "Windows"
- title: "Linux"
:::

::: step-list
- title: "터미널 열기"
  tag: "1"
  desc: "명령어를 입력하는 검은 화면 창을 열어요"
- title: "Node.js 설치 여부 확인"
  tag: "2"
  desc: "이미 설치되어 있는지 먼저 확인해봐요"
- title: "클로드 코드 설치"
  tag: "3"
  desc: "실제로 설치하는 명령어를 입력합니다"
:::

::: step-list
- title: "PowerShell 열기"
  tag: "1"
  desc: "Windows의 명령 창을 열어요"
- title: "공식 설치 스크립트 실행"
  tag: "2"
  desc: "Anthropic 공식 설치 스크립트를 사용합니다"
- title: "Node.js 별도 설치 방법 (위 방법 실패 시)"
  tag: "3"
  desc: "공식 스크립트가 안 될 때 수동으로 설치하는 방법"
- title: "설치 확인"
  tag: "4"
  desc: "제대로 설치되었는지 확인합니다"
:::

::: step-list
- title: "터미널 열기"
  tag: "1"
  desc: "리눅스에서 터미널을 실행합니다"
- title: "공식 설치 스크립트 실행"
  tag: "2"
  desc: "macOS와 동일한 방법으로 설치합니다"
- title: "Node.js 수동 설치 (필요 시)"
  tag: "3"
  desc: "Node.js가 없을 때 설치하는 방법"
:::

# 처음으로 클로드 코드 실행하기

설치가 끝났으면 이제 실행해볼까요? 처음 실행 시 로그인이 필요합니다.

::: step-list
- title: "claude 입력"
  desc: "터미널에 claude를 입력하고 Enter"
- title: "브라우저 열림"
  desc: "자동으로 웹 브라우저가 열립니다"
- title: "로그인"
  desc: "Claude.ai 계정으로 로그인합니다"
- title: "권한 허용"
  desc: "'Authorize' 버튼을 눌러 허용합니다"
- title: "시작!"
  desc: "터미널로 돌아와 사용 시작 🎉"
:::

::: step-list
- title: "클로드 코드 실행하기"
  tag: "▶"
  desc: "처음 실행 시 자동으로 로그인 화면이 나타납니다"
- title: "첫 번째 대화 시도해보기"
  tag: "✓"
  desc: "로그인 후 바로 대화를 시작할 수 있어요"
- title: "자주 쓰는 명령어"
  tag: "⌨"
  desc: "기본 명령어를 알아두면 편리해요"
:::

# 설치 중 문제가 생겼나요?

가장 자주 발생하는 문제와 해결 방법을 모아봤습니다. 아래 항목을 클릭하면 해결 방법이 펼쳐집니다.

::: faq-list
- title: "\"command not found: claude\" 오류가 나요"
  desc: "설치는 됐지만 터미널이 claude 명령어 위치를 아직 모르는 경우입니다."
- title: "npm 설치 시 \"EACCES: permission denied\" 오류가 나요"
  desc: "npm이 시스템 폴더에 쓰려고 할 때 발생하는 권한 오류입니다. 아래처럼 npm 전역 설치 경로를 내 폴더로 바꿔주세요."
- title: "Node.js 버전이 너무 낮다고 해요 (18 미만)"
  desc: "Node.js를 최신 LTS 버전으로 업그레이드해야 합니다."
- title: "로그인이 안 되거나 인증 오류가 나요"
  desc: "인증을 초기화하고 다시 시도해보세요."
- title: "Windows에서 \"Claude Code is not supported on Windows\" 오류가 나요"
  desc: "CMD나 일반 PowerShell에서 WSL(Linux) 없이 실행할 때 발생합니다. 공식 PowerShell 설치 스크립트를 사용하면 대부분 해결됩니다."
- title: "설치는 됐는데 너무 느려요 / 응답이 없어요"
  desc: "인터넷 연결 상태를 먼저 확인해주세요. 클로드 코드는 매 응답마다 Anthropic 서버와 통신합니다."
:::

# 자주 묻는 질문

설치 전후로 많이 물어보시는 질문들을 모았습니다.

::: faq-list
- title: "클로드 코드는 무료인가요?"
  desc: |
    클로드 코드 자체는 무료로 설치할 수 있지만, 사용하려면 Claude Pro($20/월) 이상 구독 또는 Anthropic API 키(사용량 기반 요금)가 필요합니다. Node.js는 완전 무료입니다.
- title: "Claude.ai와 클로드 코드의 차이가 뭔가요?"
  desc: "Claude.ai는 웹 브라우저에서 쓰는 채팅 서비스입니다. 클로드 코드는 내 컴퓨터 파일과 직접 연결되어 동작하는 개발자용 도구입니다. 둘 다 같은 AI를 사용하지만 목적과 방식이 다릅니다."
- title: "코딩을 전혀 모르는데 써도 되나요?"
  desc: "네! 한국어로 자유롭게 질문하면 됩니다. 다만 설치 과정에서 터미널 명령어를 입력해야 하므로 이 가이드를 잘 따라와 주세요. 설치 후 사용은 채팅처럼 편합니다."
- title: "Mac, Windows, Linux 모두 되나요?"
  desc: "네, 세 운영체제 모두 공식 지원됩니다. 이 가이드의 각 탭에서 운영체제별 설치 방법을 안내하고 있습니다."
- title: "설치 후 업데이트는 어떻게 하나요?"
  desc: "클로드 코드는 실행할 때마다 자동으로 최신 버전을 확인하고 업데이트합니다. 수동으로 업데이트하려면 터미널에 claude update를 입력하면 됩니다."
- title: "제 코드나 파일이 외부에 유출되나요?"
  desc: |
    클로드 코드가 파일을 읽을 때 해당 내용이 Anthropic 서버로 전송됩니다. 민감한 정보(비밀번호, 개인정보 등)가 담긴 파일은 주의하여 사용하세요. 자세한 내용은 Anthropic 개인정보처리방침을 확인하세요.
- title: "삭제(제거)는 어떻게 하나요?"
  desc: |
    터미널에서 npm uninstall -g @anthropic-ai/claude-code를 입력하면 삭제됩니다. 공식 스크립트로 설치했다면 ~/.claude 또는 ~/.local/bin/claude 파일을 삭제하면 됩니다.
- title: "한국어로 대화할 수 있나요?"
  desc: "물론입니다! 클로드 코드는 한국어를 완벽하게 지원합니다. 질문도 한국어로, 답변도 한국어로 받을 수 있습니다."
:::

## 🎉 설치 완료! 이제 시작해봐요

아래 명령어들로 클로드 코드의 다양한 기능을 탐험해보세요!

$ claude

$ claude "이 코드를 설명해줘"

$ claude doctor

📚 공식 문서 바로가기
