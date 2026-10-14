# config/library — 공용 배치 카탈로그 (pptgen 과 같이 쓰는 규칙)

cs_v2 와 pptgen(coding 저장소 `_templates/myskill/pptgen`)이 **같은 배치 이름 · 같은 항목 규칙 · 같은 서식 세트 · 같은 색 이름**을 쓰게 하는 단일 출처입니다.
한쪽에서 만든 md 를 다른 쪽에서 그대로 빌드할 수 있게 하는 것이 목적입니다.

| 파일 | 내용 |
|---|---|
| `layouts.json` | 배치 66종(`<그룹>.<형태>`), 그룹 10개, 항목 칸(Universal Schema), 색 이름(`color_tokens`), 배치별 인수·구현 상태(pptgen / cs_v2), 옛 이름(별칭) |
| `shape-sets.json` | 서식 세트 6종(template·flat·soft·outline·elevated·tinted) — 외곽선 굵기·그림자·둥글기·카드 채움·보조 카드 채움. 색은 테마 색 이름으로만 가리킴 |

## 위치와 동기화

- **현재 정본(원본)**: coding 저장소 `_templates/slide-library/catalog/`
  (ppt clone 이 뽑은 패턴·테마가 같이 쌓이는 곳이라 지금은 그쪽에 둡니다.)
- 여기 있는 두 파일은 **복사본**이고, `scripts/library-map.mjs` 는 이 복사본에서 만든 **생성본**입니다(브라우저·Node 어디서나 import 됨).
  둘 다 손으로 고치지 않습니다.

```bash
npm run sync:library          # 원본 → config/library/*.json 복사 + scripts/library-map.mjs 생성
npm run sync:library:check    # 원본과 다르면 종료코드 1 (파일은 안 바꿈)
# 원본 위치 지정: --from <폴더> 또는 환경변수 SLIDE_CATALOG
```

- **나중에 cs_v2 로 옮길 때**: 원본을 이 폴더로 옮기고, pptgen 쪽 `config/library.json` 의 `catalog.search` 첫 줄을
  `…/cs_v2/config/library` 로 바꾸면 됩니다(pptgen 은 이미 이 경로도 찾습니다). sync 스크립트는 방향만 바뀝니다.

## cs_v2 에서 쓰는 방법

```markdown
---
style: sky-blue        # 색 테마(styles.json)
shape: elevated        # 서식 세트(없으면 styles.json 테마의 shapeSet → 그것도 없으면 template)
---

## 시장 현황 {master=brand.full}      ← pptgen 용 제목 속성. cs_v2 는 지우고 읽는다

::: grid.cards cols=3                 ← 기능 이름. cs_v2 고유 이름(::: icon-grid)도 그대로 동작
- icon: "⚡"
  title: "빠름"
  desc: "설명"
  color: primary                      ← 색 이름(color_tokens) 또는 #hex
:::

::: data.stats bg=alt                 ← 이 블록 카드만 보조 카드색(한 슬라이드에 카드 배경 2종)
- icon: "29%"
  title: "성장"
:::
```

- 이름 해석: `scripts/library-names.mjs` (`resolveShortcode`) — cs_v2 고유 이름은 그대로, 기능 이름·pptgen 옛 이름은 카탈로그로 숏코드를 찾습니다.
  cs_v2 구현이 `fallback`(근사)인 배치는 가장 가까운 숏코드로, `markdown`/`none` 인 배치는 `summary-box` 로 근사합니다.
- 서식 세트: `scripts/shape-set.mjs` — HTML 은 `--set-card-bg`·`--card-alt-bg`·`--card-border-width`·`--card-border-color`·`--card-shadow`·`--card-radius` 변수,
  PPTX 는 `pal.shape` → `helpers.cardBox()`. `template` 은 기존 출력과 같습니다(보조 카드색만 정함).
- 아직 cs_v2 에 없는 것: 항목 하나만 보조색으로 바꾸는 `tag: alt`(pptgen 전용), pptgen 전용 인수(`badge`·`header`·`connector`·`emphasis`·`grow` 등 — 카탈로그 `args.*.cs_v2=false`).
