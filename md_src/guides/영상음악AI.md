---
title: "AI 영상 & 음악생성 완전 가이드"
subtitle: "AI로 멀티미디어 제작"
badge: "AI Creative Media · 2026"
style: "creative"
stats:
  - value: "Sora 2"
    label: "OpenAI 영상"
  - value: "Google Flow"
    label: "Veo 3.1 영상 플랫폼"
  - value: "Suno v5"
    label: "AI 음악 생성"
  - value: "Kling 3.0"
    label: "가성비 영상 생성"
---

# AI 영상 생성

::: tool-list
- icon: "🎬"
  title: "Google Flow"
  tag: "AI Pro/Ultra"
  desc: "labs.google/flow · Veo 3.1 기반 AI 영화 제작 워크스페이스 (구 VideoFX)"
  meta: |
    Veo 3.1 영상 생성: 텍스트·이미지·영상 프레임으로 4K급 고품질 영상 생성. 오디오·대사·효과음 동시 생성.|Ingredients & Scenebuilder: 캐릭터·장소·오브젝트를 재료로 등록 후 타임라인에서 장면을 조립.|Scene Extension: 60초를 넘는 연속 내러티브도 조명·구도 일관성을 유지하며 이어붙임.|Whisk·ImageFX·Nano Banana 통합: 워크스페이스 안에서 바로 이미지 생성 후 즉시 영상화.
:::

::: tool-list
- icon: "🎥"
  title: "Sora 2"
  tag: "Plus 이상"
  desc: "sora.com · OpenAI · 물리 시뮬레이션 기반 영상 생성"
  meta: |
    고화질 영상: 텍스트 프롬프트로 물리 법칙을 이해한 현실적 움직임의 영상 생성.|Storyboard 기능: 여러 장면을 순서대로 배치하여 단편 영상 제작. 장면 간 연속성 유지.|Re-cut & Remix: 기존 영상의 특정 부분 수정·재생성. 스타일 변환 및 영상 확장 가능.|Loop 생성: 끊김 없이 반복되는 루프 영상 생성. SNS·배경 영상 제작에 최적.
:::

::: tool-list
- icon: "🚀"
  title: "Runway Gen-4.5 / Kling 3.0"
  tag: "무료/Pro"
  desc: "runwayml.com · kling.ai · 영상 편집 특화 & 가성비 영상 생성 양대 축"
  meta: |
    Runway 이미지→영상 변환: 정적 이미지를 자연스럽게 움직이는 영상으로. 제품 사진 애니메이션에 최적.|Runway 인페인팅·아웃페인팅·모션 브러시: 영상 내 특정 영역 제거·추가·교체, 움직임 방향 직접 지정.|Runway Act-One 액팅 캡처: 웹캠으로 표정·동작 캡처 → AI 캐릭터에 적용.|Kling 3.0: 15초 클립 기준 최고 가성비(Standard 첫 달 $6.99, 이후 $8.80~10/월). 숏폼 대량 제작에 최적.
:::

# AI 음악 생성

::: tool-list
- icon: "🎵"
  title: "Suno v5"
  tag: "무료/Pro"
  desc: "suno.com · 가사+음악 동시 생성, 실제 가수와 구별 어려운 보컬 품질"
  meta: |
    장르·분위기·가사 입력 → 2분 내외 완성 노래 즉시 생성
    
     한국어 가사 포함 K-pop 스타일 생성 가능
    
     무료: 1일 50크레딧(약 10곡) — 단, 무료 플랜은 v4.5 이하만 사용 가능 | Pro $8/월: v5 모델 접근 + 무제한 상업적 이용
    
     Custom 모드: 가사·스타일·제목 직접 지정
    
     
    
     프롬프트 예: "K-pop, upbeat, female vocal, 2026 summer vibes" 또는 한국어로 "신나는 여름 팝송, 여성 보컬, 기타 중심"
:::

::: tool-list
- icon: "🎧"
  title: "Udio / ElevenLabs Music"
  tag: "무료/Pro"
  desc: "udio.com · elevenlabs.io · 전문가급 음악 품질·보이스 특화"
  meta: |
    Udio: Suno 대비 더 높은 믹싱 수준, 스템 분리(보컬·드럼·베이스 개별 추출), 곡의 특정 구간만 수정하는 Inpainting.
    
     ElevenLabs Music: 자사 음성 합성 노하우를 음악에 적용, 보이스 클로닝과 결합한 커스텀 보컬 트랙 제작에 강점.
    
     둘 다 상업적 사용 가능 (Pro 이상)
:::

::: alert-box tip
- title: "💡 Google Lyria 3 — Google Flow 통합 음악 AI:"
  desc: "Google DeepMind의 Lyria 3(싱잉 지원)가 Google Flow에 통합되어 영상 생성 시 배경음악·사운드트랙을 자동 제작합니다. YouTube MusicFX에서도 사용 가능."
:::

# 도구 선택 가이드

| 목적 | 추천 도구 | 이유 |
| --- | --- | --- |
| 영화적 단편 영상 | Google Flow | Ingredients·Scenebuilder로 캐릭터·장면 일관성 유지 |
| 현실적 물리 영상 | Sora 2 | 물리 시뮬레이션 이해, 가장 자연스러운 움직임 |
| 숏폼 대량 제작 | Kling 3.0 | 15초 클립 기준 최고 가성비 |
| 이미지 → 영상 변환 | Runway Gen-4.5 | 정적 이미지 애니메이션, 세밀한 모션 제어 |
| 완성된 노래 빠르게 | Suno v5 | 가사+음악 동시 생성, 무료 플랜 충분 |
| 고품질 음악·상업용 | Udio / ElevenLabs Music | 스템 분리, 높은 믹싱 품질 |
| 영상+음악 통합 제작 | Google Flow | Veo 3.1 + Lyria 3 + Nano Banana 올인원 |
