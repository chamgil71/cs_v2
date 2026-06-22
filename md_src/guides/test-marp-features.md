---
title: "Marp Features Test"
subtitle: "H1/H2 분할, 수평선 분할, 프론트메터 오버라이드 및 slide-config 검증"
style: productivity
fontFace: "Malgun Gothic"
titleSize: 20
bodySize: 12
---

# 1. Marp 기능 통합 테스트
본 문서는 슬라이드 분할 병행 지원 및 로컬 스타일 커스텀 기능을 검증하기 위한 테스트 가이드입니다.

- 이 슬라이드는 프론트메터 오버라이드(`fontFace: "Malgun Gothic"`)를 통해 기본 폰트가 맑은 고딕으로 적용됩니다.
- 제목 크기는 `20pt`, 본문 글자 크기는 `12pt`로 설정되었습니다.

---

## 2. 수평선 분할 검증
이 슬라이드는 H1/H2 헤더 대신 `---` 수평선 기호를 활용하여 수동 분할되었습니다.

- H1/H2 분할과 `---` 수평선 분할이 한 문서 내에서 완벽하게 공존합니다.
- 중복 분할로 인한 빈 슬라이드가 발생하지 않는지 검증합니다.

---

## 3. 다크 모드 슬라이드 테마
아래 숏코드 블록은 `::: slide-config`를 사용하여 어두운 남색 배경과 하얀색 글자로 로컬 스타일 오버라이드를 수행합니다.

::: slide-config
bg: "#0F172A"
color: "#FFFFFF"
titleSize: 24
:::

::: feature-grid cols=2
- icon: "🎨"
  title: "로컬 다크 테마"
  desc: "현재 슬라이드에서만 배경색(#0F172A)과 글자색(#FFFFFF)이 바뀝니다."
- icon: "🎯"
  title: "자동 스타일 리셋"
  desc: "이 다음 슬라이드부터는 전역 기본 라이트 모드로 자동 리셋됩니다."
:::

---

## 4. 스타일 리셋 검증
이 슬라이드는 다크 모드 슬라이드 뒤에 배치된 표준 슬라이드입니다.

- 배경색과 글자색이 이전 슬라이드의 `::: slide-config`에 오염되지 않고 원래의 라이트 모드로 자동 복원되는지 확인합니다.

---

## 5. 이미지 렌더링 검증
아래는 외부 이미지 링크가 PPTX와 HTML에서 모두 깨지지 않고 렌더링되는지 확인합니다.

![테스트 툴바 아이콘](https://raw.githubusercontent.com/marp-team/marp-vscode/main/docs/toolbar-icon.png)
