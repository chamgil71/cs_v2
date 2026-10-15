// ⚠️ 자동 생성 파일 — 손으로 고치지 마세요. 원본: slide-library/catalog (npm run sync:library)
// 카탈로그 갱신일 layouts=2026-10-14 shape-sets=2026-10-14
export const LIBRARY_UPDATED = "2026-10-14";
export const LAYOUT_GROUPS = {
 "grid": "분할·카드 — 관계 없는 대등한 N개를 칸·카드로 나란히",
 "compare": "비교·대조 — 둘 이상을 맞대어 차이를 보임",
 "process": "순서·흐름 — 단계·시간·성장·분기",
 "structure": "구조·관계 — 중심-주변, 기반-기둥, 포함, 교집합, 그룹",
 "data": "데이터·수치 — 숫자·비율·위치가 주인공",
 "text": "서술·강조 — 한 문장·인용·알림·요약이 주인공",
 "code": "코드·터미널 — 코드·명령·실행 결과",
 "nav": "탐색·목록 — 목차·탭·질문답변처럼 문서를 훑게 하는 목록",
 "media": "이미지 혼합 — 이미지가 칸의 절반 이상",
 "sample": "견본 — 원본 내용이 박힌 참고용(재사용 비권장)"
};
export const LAYOUTS = {
 "grid.cards": {
  "group": "grid",
  "label": "아이콘 카드 격자(아이콘·제목·설명)",
  "emoji": "🧩",
  "desc": "아이콘+제목+설명 카드 격자. align 으로 모양 변형: center(기본) / left(왼쪽 아이콘) / row(수평 배열).",
  "fields": {
   "icon": "아이콘 키 또는 이모지",
   "title": "제목",
   "desc": "설명",
   "color": "카드 강조색(선택)"
  },
  "status": "ready",
  "shortcode": "icon-grid",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {
   "align": "center",
   "badge": "icon"
  },
  "args": {
   "cols": {
    "values": "1~6",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "비우면 항목 수에 맞춤."
   },
   "align": {
    "values": "center|left|row",
    "default": "center",
    "cs_v2": true,
    "pptgen": true,
    "note": "left=왼쪽 아이콘, row=가로 한 줄형"
   },
   "badge": {
    "values": "icon|number|none",
    "default": "icon",
    "cs_v2": true,
    "pptgen": true,
    "note": "카드·노드의 원 칸에 아이콘/번호/없음"
   },
   "header": {
    "values": "문자열",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "본문 위 머리띠 한 줄"
   },
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "icon-grid",
   "skill-list",
   "checkpoint-grid"
  ]
 },
 "grid.features": {
  "group": "grid",
  "label": "기능 카드(제목·태그·설명)",
  "emoji": "⭐",
  "desc": "태그 배지 및 아이콘이 포함된 다채로운 핵심 피처 카드 그리드입니다.",
  "fields": {
   "icon": "아이콘(선택)",
   "title": "제목",
   "tag": "오른쪽 위 꼬리표",
   "desc": "설명"
  },
  "status": "ready",
  "shortcode": "feature-grid",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {},
  "args": {
   "cols": {
    "values": "1~6",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "비우면 항목 수에 맞춤."
   },
   "header": {
    "values": "문자열",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "본문 위 머리띠 한 줄"
   },
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "feature-grid"
  ]
 },
 "grid.badges": {
  "group": "grid",
  "label": "작은 칩 묶음(이름·꼬리표)",
  "emoji": "🏷️",
  "desc": "여러 장점이나 키워드를 작은 배지 칩으로 콤팩트하게 나열합니다.",
  "fields": {
   "icon": "아이콘",
   "title": "이름",
   "tag": "꼬리표"
  },
  "status": "ready",
  "shortcode": "badge-grid",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {},
  "args": {
   "cols": {
    "values": "1~6",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "비우면 항목 수에 맞춤."
   },
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "badge-grid"
  ]
 },
 "grid.list": {
  "group": "grid",
  "label": "머리띠 목록 카드(이름·설명·글머리)",
  "emoji": "🧰",
  "desc": "사용 도구나 스펙의 강점을 헤더(아이콘, 제목, 부제)와 기능 목록 형태로 렌더링합니다.",
  "fields": {
   "icon": "아이콘",
   "title": "이름",
   "desc": "한 줄 설명",
   "tag": "꼬리표",
   "meta": "글머리(｜ 구분)"
  },
  "status": "ready",
  "shortcode": "tool-list",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {},
  "args": {
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "tool-list",
   "tool-box"
  ]
 },
 "grid.tiers": {
  "group": "grid",
  "label": "등급·선택지 카드(강조 1개)",
  "emoji": "💳",
  "desc": "추천 요금제(tag=Best)나 상품 가격/기능 구성품 스펙을 카드 형태로 비교합니다.",
  "fields": {
   "title": "등급 이름",
   "tag": "꼬리표(가격·Best 등)",
   "meta": "구성 목록(｜ 구분)",
   "featured": "true = 강조 카드",
   "note": "아래 설명"
  },
  "status": "ready",
  "shortcode": "plan-grid",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {},
  "args": {
   "cols": {
    "values": "1~6",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "비우면 항목 수에 맞춤."
   },
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "plan-grid"
  ]
 },
 "grid.columns": {
  "group": "grid",
  "label": "다단 정보 카드(제목·설명·팁)",
  "emoji": "🗂️",
  "desc": "가로 다단 카드 격자. variant=plain 이면 상단 색 띠 없는 담백한 카드(비교 용도).",
  "fields": {
   "title": "제목",
   "desc": "설명",
   "note": "아래 팁 상자",
   "color": "카드 강조색"
  },
  "status": "ready",
  "shortcode": "columns-grid",
  "pptx_shortcode": null,
  "variants": [
   {
    "when": {
     "variant": "plain"
    },
    "shortcode": "compare-grid"
   }
  ],
  "defaults": {
   "variant": "card"
  },
  "args": {
   "cols": {
    "values": "1~6",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "비우면 항목 수에 맞춤."
   },
   "header": {
    "values": "문자열",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "본문 위 머리띠 한 줄"
   },
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "variant": {
    "values": "card|plain",
    "default": "card",
    "cs_v2": true,
    "pptgen": true,
    "note": "plain = 상단 색 띠 없는 담백한 카드(옛 compare-grid)"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "columns-grid",
   "compare-grid"
  ]
 },
 "grid.main-plus-3": {
  "group": "grid",
  "label": "큰 칸 1 + 세로 작은 칸 3",
  "emoji": "🧱",
  "desc": "큰 칸 하나(핵심)와 오른쪽에 세로로 쌓은 작은 칸 셋. 핵심 하나를 크게 두고 보조 항목 셋을 곁들일 때.",
  "fields": {
   "title": "소제목(상자 첫 줄)",
   "meta": "글머리(｜ 구분)",
   "desc": "글머리로 이어 붙임"
  },
  "status": "ready",
  "shortcode": "grid.main-plus-3",
  "pptx_shortcode": "columns-grid",
  "variants": [],
  "defaults": {},
  "args": {
   "header": {
    "values": "문자열",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "고정 칸(머리띠 등)"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": "c01-p01",
   "theme": "company-01"
  },
  "aliases": [
   "c01-p01"
  ]
 },
 "grid.cards-icon-3": {
  "group": "grid",
  "label": "카드 3열(알약 제목·원·설명)",
  "emoji": "🎴",
  "desc": "카드 3열 — 알약 제목, 원 안의 짧은 말(desc), 아래 글머리. 세 축을 같은 무게로 보여 줄 때.",
  "fields": {
   "title": "소제목(상자 첫 줄)",
   "meta": "글머리(｜ 구분)",
   "desc": "글머리로 이어 붙임"
  },
  "status": "ready",
  "shortcode": "grid.cards-icon-3",
  "pptx_shortcode": "columns-grid",
  "variants": [],
  "defaults": {},
  "args": {
   "header": {
    "values": "문자열",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "고정 칸(머리띠 등)"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": "c01-p03",
   "theme": "company-01"
  },
  "aliases": [
   "c01-p03"
  ]
 },
 "grid.wide-narrow-titled": {
  "group": "grid",
  "label": "넓은 칸 + 좁은 칸(알약 제목)",
  "emoji": "📐",
  "desc": "넓은 칸 + 좁은 칸, 칸마다 알약 제목. 주 내용과 보조 내용을 나란히.",
  "fields": {
   "title": "소제목(상자 첫 줄)",
   "meta": "글머리(｜ 구분)",
   "desc": "글머리로 이어 붙임"
  },
  "status": "ready",
  "shortcode": "grid.wide-narrow-titled",
  "pptx_shortcode": "columns-grid",
  "variants": [],
  "defaults": {},
  "args": {
   "header": {
    "values": "문자열",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "고정 칸(머리띠 등)"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": "c01-p04",
   "theme": "company-01"
  },
  "aliases": [
   "c01-p04"
  ]
 },
 "grid.narrow-wide-titled": {
  "group": "grid",
  "label": "좁은 칸 + 넓은 칸(알약 제목)",
  "emoji": "📐",
  "desc": "좁은 칸 + 넓은 칸, 칸마다 알약 제목. 짧은 요약 옆에 긴 설명을 둘 때.",
  "fields": {
   "title": "소제목(상자 첫 줄)",
   "meta": "글머리(｜ 구분)",
   "desc": "글머리로 이어 붙임"
  },
  "status": "ready",
  "shortcode": "grid.narrow-wide-titled",
  "pptx_shortcode": "columns-grid",
  "variants": [],
  "defaults": {},
  "args": {
   "header": {
    "values": "문자열",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "고정 칸(머리띠 등)"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": "c01-p05",
   "theme": "company-01"
  },
  "aliases": [
   "c01-p05"
  ]
 },
 "grid.box-1": {
  "group": "grid",
  "label": "빈 상자 1(본문 전체)",
  "emoji": "⬜",
  "desc": "본문 전체를 차지하는 상자 하나 — 제목과 글머리. 한 가지 메시지를 넓게.",
  "fields": {
   "title": "소제목(상자 첫 줄)",
   "meta": "글머리(｜ 구분)",
   "desc": "글머리로 이어 붙임"
  },
  "status": "ready",
  "shortcode": "grid.box-1",
  "pptx_shortcode": "columns-grid",
  "variants": [],
  "defaults": {},
  "args": {
   "header": {
    "values": "문자열",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "고정 칸(머리띠 등)"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": "c01-p11",
   "theme": "company-01"
  },
  "aliases": [
   "c01-p11"
  ]
 },
 "grid.box-2": {
  "group": "grid",
  "label": "빈 상자 2 균등",
  "emoji": "⬜",
  "desc": "같은 크기 상자 2개 — 제목과 글머리. 대등한 두 항목(기회/위험 등).",
  "fields": {
   "title": "소제목(상자 첫 줄)",
   "meta": "글머리(｜ 구분)",
   "desc": "글머리로 이어 붙임"
  },
  "status": "ready",
  "shortcode": "grid.box-2",
  "pptx_shortcode": "columns-grid",
  "variants": [],
  "defaults": {},
  "args": {
   "header": {
    "values": "문자열",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "고정 칸(머리띠 등)"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": "c01-p12",
   "theme": "company-01"
  },
  "aliases": [
   "c01-p12"
  ]
 },
 "grid.box-3": {
  "group": "grid",
  "label": "빈 상자 3 균등",
  "emoji": "⬜",
  "desc": "같은 크기 상자 3개 — 제목과 글머리. 대등한 세 축(사람·프로세스·기술 등).",
  "fields": {
   "title": "소제목(상자 첫 줄)",
   "meta": "글머리(｜ 구분)",
   "desc": "글머리로 이어 붙임"
  },
  "status": "ready",
  "shortcode": "grid.box-3",
  "pptx_shortcode": "columns-grid",
  "variants": [],
  "defaults": {},
  "args": {
   "header": {
    "values": "문자열",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "고정 칸(머리띠 등)"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": "c01-p13",
   "theme": "company-01"
  },
  "aliases": [
   "c01-p13"
  ]
 },
 "grid.box-4": {
  "group": "grid",
  "label": "빈 상자 4 균등",
  "emoji": "⬜",
  "desc": "같은 크기 상자 4개 — 제목과 글머리. 4단계 순환이나 네 영역.",
  "fields": {
   "title": "소제목(상자 첫 줄)",
   "meta": "글머리(｜ 구분)",
   "desc": "글머리로 이어 붙임"
  },
  "status": "ready",
  "shortcode": "grid.box-4",
  "pptx_shortcode": "columns-grid",
  "variants": [],
  "defaults": {},
  "args": {
   "header": {
    "values": "문자열",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "고정 칸(머리띠 등)"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": "c01-p14",
   "theme": "company-01"
  },
  "aliases": [
   "c01-p14"
  ]
 },
 "grid.narrow-wide": {
  "group": "grid",
  "label": "좁은 칸 + 넓은 칸",
  "emoji": "📏",
  "desc": "좁은 칸 + 넓은 칸. 요약과 설명을 좌우로.",
  "fields": {
   "title": "소제목(상자 첫 줄)",
   "meta": "글머리(｜ 구분)",
   "desc": "글머리로 이어 붙임"
  },
  "status": "ready",
  "shortcode": "grid.narrow-wide",
  "pptx_shortcode": "columns-grid",
  "variants": [],
  "defaults": {},
  "args": {
   "header": {
    "values": "문자열",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "고정 칸(머리띠 등)"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": "c01-p15",
   "theme": "company-01"
  },
  "aliases": [
   "c01-p15"
  ]
 },
 "grid.wide-narrow": {
  "group": "grid",
  "label": "넓은 칸 + 좁은 칸",
  "emoji": "📏",
  "desc": "넓은 칸 + 좁은 칸. 설명과 요약을 좌우로.",
  "fields": {
   "title": "소제목(상자 첫 줄)",
   "meta": "글머리(｜ 구분)",
   "desc": "글머리로 이어 붙임"
  },
  "status": "ready",
  "shortcode": "grid.wide-narrow",
  "pptx_shortcode": "columns-grid",
  "variants": [],
  "defaults": {},
  "args": {
   "header": {
    "values": "문자열",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "고정 칸(머리띠 등)"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": "c01-p16",
   "theme": "company-01"
  },
  "aliases": [
   "c01-p16"
  ]
 },
 "grid.circle-3": {
  "group": "grid",
  "label": "큰 원 3",
  "emoji": "⚪",
  "desc": "큰 원 3개 — 원 안에 제목, 아래 글머리. 세 개념을 상징적으로.",
  "fields": {
   "title": "소제목(상자 첫 줄)",
   "meta": "글머리(｜ 구분)",
   "desc": "글머리로 이어 붙임"
  },
  "status": "ready",
  "shortcode": "grid.circle-3",
  "pptx_shortcode": "columns-grid",
  "variants": [],
  "defaults": {},
  "args": {
   "header": {
    "values": "문자열",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "고정 칸(머리띠 등)"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": "c01-p17",
   "theme": "company-01"
  },
  "aliases": [
   "c01-p17"
  ]
 },
 "grid.band-box-3": {
  "group": "grid",
  "label": "머리띠 + 상자 3",
  "emoji": "🎗️",
  "desc": "위 머리띠(header 인수) + 상자 3개. 상위 메시지 아래 세 축을 펼칠 때.",
  "fields": {
   "title": "소제목(상자 첫 줄)",
   "meta": "글머리(｜ 구분)",
   "desc": "글머리로 이어 붙임"
  },
  "status": "ready",
  "shortcode": "grid.band-box-3",
  "pptx_shortcode": "columns-grid",
  "variants": [],
  "defaults": {},
  "args": {
   "header": {
    "values": "문자열",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "고정 칸(머리띠 등)"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": "c01-p18",
   "theme": "company-01"
  },
  "aliases": [
   "c01-p18"
  ]
 },
 "compare.pair": {
  "group": "compare",
  "label": "좌우 2단 비교(제목·설명·글머리)",
  "emoji": "⚖️",
  "desc": "두 대상을 좌우로 2단 분할 배치하여 전후 관계나 상세 비교를 렌더링합니다.",
  "fields": {
   "title": "쪽 이름",
   "desc": "설명",
   "meta": "글머리(｜ 구분)",
   "color": "쪽 색"
  },
  "status": "ready",
  "shortcode": "compare-split",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {},
  "args": {
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "compare-split",
   "split-2box"
  ]
 },
 "compare.before-after": {
  "group": "compare",
  "label": "전·후 대조(❌ → ✅)",
  "emoji": "🔍",
  "desc": "AS-IS(구형)와 TO-BE(신형)를 ❌/✅ 레이블로 단순 명확하게 전후 대조합니다.",
  "fields": {
   "title": "상태 이름",
   "desc": "설명"
  },
  "status": "ready",
  "shortcode": "before-after",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {},
  "args": {
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "before-after",
   "compare-diff",
   "compare-before-after"
  ]
 },
 "compare.main-sub": {
  "group": "compare",
  "label": "비대칭 2분할(주 / 부)",
  "emoji": "⚖️",
  "desc": "비대칭 2분할 — 주 칸이 크고 부 칸이 작다(ratio 인수). 핵심 주장과 보조 정보를 함께.",
  "fields": {
   "title": "쪽 이름",
   "desc": "설명",
   "meta": "글머리"
  },
  "status": "ready",
  "shortcode": "compare.main-sub",
  "pptx_shortcode": "compare-split",
  "variants": [],
  "defaults": {
   "ratio": "0.64"
  },
  "args": {
   "ratio": {
    "values": "0.5~0.75",
    "default": "0.64",
    "cs_v2": true,
    "pptgen": true,
    "note": "주 칸 비율"
   },
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "asymmetric-split"
  ]
 },
 "compare.balance": {
  "group": "compare",
  "label": "천칭 균형 비교",
  "emoji": "⚖️",
  "desc": "천칭 위 두 쪽 — 균형·절충 관계(속도 대 안전 등)를 보여 줄 때.",
  "fields": {
   "icon": "아이콘",
   "title": "쪽 이름",
   "desc": "설명"
  },
  "status": "ready",
  "shortcode": "compare.balance",
  "pptx_shortcode": "compare-split",
  "variants": [],
  "defaults": {},
  "args": {
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "balance-beam"
  ]
 },
 "compare.hbars": {
  "group": "compare",
  "label": "가로 막대 스택 비교",
  "emoji": "📶",
  "desc": "가로 막대를 쌓아 단계별 확장을 비교(뒤로 갈수록 넓어짐). emphasis 로 강조 막대.",
  "fields": {
   "icon": "아이콘",
   "title": "이름",
   "desc": "설명",
   "tag": "highlight = 강조"
  },
  "status": "ready",
  "shortcode": "compare.hbars",
  "pptx_shortcode": "tool-list",
  "variants": [],
  "defaults": {
   "emphasis": "none"
  },
  "args": {
   "emphasis": {
    "values": "last|first|none|<번호>",
    "default": "none",
    "cs_v2": true,
    "pptgen": true,
    "note": "강조할 항목(테마 accent). 항목 tag: highlight/active 도 같은 뜻"
   },
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "stacked-bars"
  ]
 },
 "compare.pair-summary": {
  "group": "compare",
  "label": "좌우 비교 + 하단 결론 띠",
  "emoji": "🔀",
  "desc": "좌우 비교 칸 + 아래 결론 띠(header 인수). 비교 끝에 한 줄 결론.",
  "fields": {
   "title": "칸 이름(알약)",
   "desc": "설명",
   "meta": "글머리(｜ 구분)"
  },
  "status": "ready",
  "shortcode": "compare.pair-summary",
  "pptx_shortcode": "compare-split",
  "variants": [],
  "defaults": {},
  "args": {
   "header": {
    "values": "문자열",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "고정 칸"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": "c01-p08",
   "theme": "company-01"
  },
  "aliases": [
   "c01-p08"
  ]
 },
 "process.track": {
  "group": "process",
  "label": "단계 흐름(아이콘 노드·연결)",
  "emoji": "➡️",
  "desc": "단계별 흐름을 가로로 표현. connector=line(기본) 이면 단계 사이 가는 선, arrow 면 화살표로 이은 단계, none 이면 연결 없음(화살표는 type: arrow 항목). tag:active 또는 emphasis=last|first|번호 로 강조, badge=number|none 으로 원 칸 변경, meta 로 도구/코멘트.",
  "fields": {
   "icon": "아이콘",
   "title": "단계",
   "desc": "설명",
   "meta": "도구·코멘트",
   "tag": "active = 강조"
  },
  "status": "ready",
  "shortcode": "step-flow",
  "pptx_shortcode": null,
  "variants": [
   {
    "when": {
     "connector": "arrow"
    },
    "shortcode": "workflow-flow"
   }
  ],
  "defaults": {
   "connector": "line",
   "badge": "icon",
   "emphasis": "none"
  },
  "args": {
   "connector": {
    "values": "arrow|line|none",
    "default": "line",
    "cs_v2": true,
    "pptgen": true,
    "note": "항목 사이 연결. line = 단계 사이 가는 선, arrow = 화살표로 이은 단계(옛 workflow-flow), none = 연결 없음(옛 step-flow — 화살표는 type: arrow 항목으로)"
   },
   "badge": {
    "values": "icon|number|none",
    "default": "icon",
    "cs_v2": true,
    "pptgen": true,
    "note": "카드·노드의 원 칸에 아이콘/번호/없음"
   },
   "emphasis": {
    "values": "last|first|none|<번호>",
    "default": "none",
    "cs_v2": true,
    "pptgen": true,
    "note": "강조할 항목(테마 accent). 항목 tag: highlight/active 도 같은 뜻"
   },
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "step-flow",
   "workflow-flow",
   "workflow-strip",
   "flow",
   "flow-track"
  ]
 },
 "process.steps": {
  "group": "process",
  "label": "번호 단계 목록(세로)",
  "emoji": "🔢",
  "desc": "1, 2, 3... 순번이 자동으로 매겨진 단계식 지침과 부연 설명을 노출합니다.",
  "fields": {
   "title": "단계",
   "desc": "설명",
   "color": "번호색"
  },
  "status": "ready",
  "shortcode": "step-list",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {
   "badge": "number"
  },
  "args": {
   "badge": {
    "values": "icon|number|none",
    "default": "number",
    "cs_v2": true,
    "pptgen": true,
    "note": "카드·노드의 원 칸에 아이콘/번호/없음"
   },
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "step-list"
  ]
 },
 "process.staircase": {
  "group": "process",
  "label": "계단식 단계(뒤로 갈수록 높아짐)",
  "emoji": "🪜",
  "desc": "뒤로 갈수록 높아지는 계단 — 진화·성장 단계. grow(높이 배율)·emphasis·caption, meta = 시점.",
  "fields": {
   "icon": "아이콘",
   "title": "단계",
   "desc": "설명",
   "meta": "시점",
   "tag": "highlight = 강조"
  },
  "status": "ready",
  "shortcode": "process.staircase",
  "pptx_shortcode": "level-grid",
  "variants": [],
  "defaults": {
   "grow": "1.35",
   "emphasis": "last"
  },
  "args": {
   "grow": {
    "values": "1.0~1.6",
    "default": "1.35",
    "cs_v2": true,
    "pptgen": true,
    "note": "한 단마다 높이 배율(1.0 = 같은 높이)"
   },
   "emphasis": {
    "values": "last|first|none|<번호>",
    "default": "last",
    "cs_v2": true,
    "pptgen": true,
    "note": "강조할 항목(테마 accent). 항목 tag: highlight/active 도 같은 뜻"
   },
   "caption": {
    "values": "문자열",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "아래 캡션 상자"
   },
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "staircase"
  ]
 },
 "process.levels": {
  "group": "process",
  "label": "수준·단계 스펙트럼 카드",
  "emoji": "📶",
  "desc": "난이도·성숙도·역량 구간을 카드 격자로 비교. tag:highlight 로 강조 카드 지정.",
  "fields": {
   "title": "수준",
   "desc": "설명",
   "tag": "highlight = 강조",
   "color": "색"
  },
  "status": "ready",
  "shortcode": "level-grid",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {
   "grow": "1.0",
   "emphasis": "none"
  },
  "args": {
   "cols": {
    "values": "1~6",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 항목 수에 맞춤."
   },
   "grow": {
    "values": "1.0~1.6",
    "default": "1.0",
    "cs_v2": true,
    "pptgen": true,
    "note": "뒤 카드일수록 높게"
   },
   "emphasis": {
    "values": "last|first|none|<번호>",
    "default": "none",
    "cs_v2": true,
    "pptgen": true,
    "note": "강조할 항목(테마 accent). 항목 tag: highlight/active 도 같은 뜻"
   },
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "level-grid"
  ]
 },
 "process.branch": {
  "group": "process",
  "label": "분기 흐름(커밋·브랜치 같은 갈래 단계)",
  "emoji": "🔧",
  "desc": "Git 브랜치나 버전 릴리즈 흐름을 노드형 다이어그램으로 가시화합니다.",
  "fields": {
   "title": "단계",
   "tag": "갈래 이름",
   "meta": "설명",
   "color": "갈래 색"
  },
  "status": "ready",
  "shortcode": "git-flow",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {
   "connector": "line"
  },
  "args": {
   "connector": {
    "values": "arrow|line|none",
    "default": "line",
    "cs_v2": true,
    "pptgen": true,
    "note": "항목 사이 연결"
   },
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "git-flow",
   "git-flow-strip"
  ]
 },
 "process.growth": {
  "group": "process",
  "label": "성장 서사(이전 → 이후 패널)",
  "emoji": "📈",
  "desc": "이전 → 이후 두 패널로 성장 서사를 보여 줌. icon = 수치(1억 → 8억).",
  "fields": {
   "title": "상태",
   "desc": "설명",
   "icon": "수치"
  },
  "status": "ready",
  "shortcode": "process.growth",
  "pptx_shortcode": "before-after",
  "variants": [],
  "defaults": {},
  "args": {
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "growth-panel"
  ]
 },
 "process.cycle-3": {
  "group": "process",
  "label": "삼각 순환",
  "emoji": "🔄",
  "desc": "세 단계가 돌아가는 삼각 순환(기록 → 학습 → 적용).",
  "fields": {
   "icon": "아이콘",
   "title": "단계",
   "desc": "설명"
  },
  "status": "ready",
  "shortcode": "process.cycle-3",
  "pptx_shortcode": "step-flow",
  "variants": [],
  "defaults": {},
  "args": {
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "triangle-cycle"
  ]
 },
 "process.zigzag": {
  "group": "process",
  "label": "지그재그 로드맵",
  "emoji": "〰️",
  "desc": "위·아래로 번갈아 놓인 노드를 잇는 지그재그 로드맵. emphasis 로 현재 단계.",
  "fields": {
   "icon": "아이콘",
   "title": "단계",
   "desc": "설명"
  },
  "status": "ready",
  "shortcode": "process.zigzag",
  "pptx_shortcode": "step-flow",
  "variants": [],
  "defaults": {
   "emphasis": "none"
  },
  "args": {
   "emphasis": {
    "values": "last|first|none|<번호>",
    "default": "none",
    "cs_v2": true,
    "pptgen": true,
    "note": "강조할 항목(테마 accent). 항목 tag: highlight/active 도 같은 뜻"
   },
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "zigzag-path"
  ]
 },
 "process.cards-arrow-4": {
  "group": "process",
  "label": "카드 4단계 + 화살표(원·하단 목록)",
  "emoji": "➡️",
  "desc": "카드 4단계를 화살표로 잇고, 카드마다 알약 제목·원(desc)·글머리 목록.",
  "fields": {
   "title": "단계 이름",
   "desc": "원 안 글(짧게)",
   "meta": "글머리(｜ 구분)"
  },
  "status": "ready",
  "shortcode": "process.cards-arrow-4",
  "pptx_shortcode": "step-flow",
  "variants": [],
  "defaults": {},
  "args": {
   "header": {
    "values": "문자열",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "고정 칸"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": "c01-p02",
   "theme": "company-01"
  },
  "aliases": [
   "c01-p02"
  ]
 },
 "process.input-circles-4": {
  "group": "process",
  "label": "입력 상자 → 원 4단계 → 하단 흐름",
  "emoji": "🔵",
  "desc": "원 4단계를 화살표로 잇고 아래 흐름 띠. 원 안에 단계 이름과 짧은 말, 아래 글머리.",
  "fields": {
   "title": "단계 이름",
   "desc": "원 안 글(짧게)",
   "meta": "글머리(｜ 구분)"
  },
  "status": "ready",
  "shortcode": "process.input-circles-4",
  "pptx_shortcode": "step-flow",
  "variants": [],
  "defaults": {},
  "args": {
   "header": {
    "values": "문자열",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "고정 칸"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": "c01-p06",
   "theme": "company-01"
  },
  "aliases": [
   "c01-p06"
  ]
 },
 "process.band-columns-3": {
  "group": "process",
  "label": "머리띠 + 3열(원·전→후 비교)",
  "emoji": "🎗️",
  "desc": "머리띠 + 3열 — 열마다 번호 원·제목·전 → 후 짝(meta 를 짝으로 읽음). 변화 비교.",
  "fields": {
   "title": "열 이름",
   "desc": "번호 원 글",
   "meta": "전 | 후 | 전 | 후 … (짝으로 읽어 전 → 후 줄)"
  },
  "status": "ready",
  "shortcode": "process.band-columns-3",
  "pptx_shortcode": "step-flow",
  "variants": [],
  "defaults": {},
  "args": {
   "header": {
    "values": "문자열",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "고정 칸"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": "c01-p07",
   "theme": "company-01"
  },
  "aliases": [
   "c01-p07"
  ]
 },
 "process.steps-checklist-3": {
  "group": "process",
  "label": "머리띠 + 3단계 + 체크 목록",
  "emoji": "✅",
  "desc": "머리띠 + 3단계 — 단계마다 번호 원·제목·체크 목록.",
  "fields": {
   "title": "단계 이름",
   "desc": "번호 원 글",
   "meta": "체크 목록(｜ 구분)"
  },
  "status": "ready",
  "shortcode": "process.steps-checklist-3",
  "pptx_shortcode": "step-flow",
  "variants": [],
  "defaults": {},
  "args": {
   "header": {
    "values": "문자열",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "고정 칸"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": "c01-p10",
   "theme": "company-01"
  },
  "aliases": [
   "c01-p10"
  ]
 },
 "structure.hub": {
  "group": "structure",
  "label": "중심-주변(허브·스포크)",
  "emoji": "🕸️",
  "desc": "여러 개념 간의 연계성 또는 네트워크 연결 관계를 시각화합니다.",
  "fields": {
   "title": "첫 항목 = 중심, 나머지 = 주변",
   "meta": "관계 설명",
   "icon": "아이콘",
   "color": "색"
  },
  "status": "ready",
  "shortcode": "network-box",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {},
  "args": {
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "network-box",
   "hub-spoke"
  ]
 },
 "structure.pillars": {
  "group": "structure",
  "label": "기반 위 기둥",
  "emoji": "🏛️",
  "desc": "기반 위에 선 기둥 — 첫 항목이 기반(아래 띠), 나머지가 기둥.",
  "fields": {
   "title": "첫 항목 = 기반, 나머지 = 기둥",
   "desc": "설명",
   "icon": "아이콘"
  },
  "status": "ready",
  "shortcode": "structure.pillars",
  "pptx_shortcode": "columns-grid",
  "variants": [],
  "defaults": {},
  "args": {
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "pillars-on-base"
  ]
 },
 "structure.rings": {
  "group": "structure",
  "label": "동심원 포함관계(바깥 → 안)",
  "emoji": "🎯",
  "desc": "A⊃B⊃C 같은 계층적 포함관계 표현. 항목은 바깥(큰 범주)에서 안쪽(구체적 범주) 순서로 작성.",
  "fields": {
   "title": "범주",
   "color": "색",
   "icon": "마지막 항목 = 중심 아이콘"
  },
  "status": "ready",
  "shortcode": "concentric-rings",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {},
  "args": {
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "concentric-rings"
  ]
 },
 "structure.venn": {
  "group": "structure",
  "label": "벤 다이어그램(두 원 + 교집합)",
  "emoji": "⭕",
  "desc": "두 영역이 겹칠 때 새로운 가치/의미가 발생함을 표현. 항목 3개 고정 순서(왼쪽 원 / 오른쪽 원 / 교집합 캡션).",
  "fields": {
   "title": "[0] 왼쪽 원 · [1] 오른쪽 원",
   "desc": "[2] 교집합 설명",
   "icon": "[2] 교집합 아이콘",
   "color": "원 색"
  },
  "status": "ready",
  "shortcode": "venn-diagram",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {},
  "args": {
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "venn-diagram",
   "venn"
  ]
 },
 "structure.groups-2x3": {
  "group": "structure",
  "label": "2그룹 × 원 3",
  "emoji": "🫧",
  "desc": "두 그룹 × 원 여러 개 — 그룹마다 알약 제목·설명, meta 를 원으로.",
  "fields": {
   "title": "그룹 이름(알약)",
   "desc": "설명",
   "meta": "원(｜ 구분, 3~4개)"
  },
  "status": "ready",
  "shortcode": "structure.groups-2x3",
  "pptx_shortcode": "columns-grid",
  "variants": [],
  "defaults": {},
  "args": {},
  "pptgen": {
   "status": "ready",
   "pattern": "c01-p09",
   "theme": "company-01"
  },
  "aliases": [
   "c01-p09"
  ]
 },
 "data.stats": {
  "group": "data",
  "label": "통계 패널(큰 수치·이름·설명)",
  "emoji": "📊",
  "desc": "수치 데이터(icon)와 통계 지표 정보(title, desc)를 상단 바 보더와 함께 시각화합니다.",
  "fields": {
   "icon": "수치(예: 53%)",
   "title": "지표 이름",
   "desc": "설명",
   "color": "색"
  },
  "status": "ready",
  "shortcode": "stat-grid",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {
   "emphasis": "none"
  },
  "args": {
   "cols": {
    "values": "1~6",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "비우면 항목 수에 맞춤."
   },
   "emphasis": {
    "values": "last|first|none|<번호>",
    "default": "none",
    "cs_v2": true,
    "pptgen": true,
    "note": "강조할 항목(테마 accent). 항목 tag: highlight/active 도 같은 뜻"
   },
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "stat-grid",
   "stat-row"
  ]
 },
 "data.summary-bar": {
  "group": "data",
  "label": "수치 요약 띠(한 줄)",
  "emoji": "📈",
  "desc": "수치 통계나 단위 성과들을 가로형 바 형태로 간결하게 나열합니다.",
  "fields": {
   "icon": "수치",
   "title": "이름"
  },
  "status": "ready",
  "shortcode": "summary-bar",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {},
  "args": {
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "summary-bar"
  ]
 },
 "data.bars": {
  "group": "data",
  "label": "막대그래프(극단 대비)",
  "emoji": "📊",
  "desc": "가로 막대그래프 — 값(icon)의 극단 대비를 sqrt 척도로 읽히게(scale 인수). emphasis 로 강조 막대.",
  "fields": {
   "title": "이름",
   "icon": "값(숫자)",
   "tag": "highlight = 강조"
  },
  "status": "ready",
  "shortcode": "data.bars",
  "pptx_shortcode": "stat-grid",
  "variants": [],
  "defaults": {
   "scale": "sqrt",
   "emphasis": "none"
  },
  "args": {
   "scale": {
    "values": "linear|sqrt",
    "default": "sqrt",
    "cs_v2": true,
    "pptgen": true,
    "note": "막대 길이 척도"
   },
   "emphasis": {
    "values": "last|first|none|<번호>",
    "default": "none",
    "cs_v2": true,
    "pptgen": true,
    "note": "강조할 항목(테마 accent). 항목 tag: highlight/active 도 같은 뜻"
   },
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "bar-chart"
  ]
 },
 "data.quadrant": {
  "group": "data",
  "label": "사분면 위치 차트",
  "emoji": "📍",
  "desc": "두 축(X/Y) 기준으로 여러 항목의 상대 위치를 비교. 축 라벨은 블록 인수로 지정.",
  "fields": {
   "title": "점 이름",
   "fx": "가로 위치 0~1",
   "fy": "세로 위치 0~1",
   "color": "색"
  },
  "status": "ready",
  "shortcode": "quadrant-chart",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {},
  "args": {
   "xLabel": {
    "values": "문자열",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": ""
   },
   "yLabel": {
    "values": "문자열",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": ""
   },
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "quadrant-chart"
  ]
 },
 "data.gauge": {
  "group": "data",
  "label": "반원 게이지(위치·비율)",
  "emoji": "⏲️",
  "desc": "반원 게이지 — 값(icon, 0~100)의 위치·비율. left/right 인수로 호 양 끝 이름.",
  "fields": {
   "title": "이름",
   "icon": "값(0~100)",
   "desc": "설명"
  },
  "status": "ready",
  "shortcode": "data.gauge",
  "pptx_shortcode": "stat-grid",
  "variants": [],
  "defaults": {},
  "args": {
   "left": {
    "values": "문자열",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "호 양 끝 이름"
   },
   "right": {
    "values": "문자열",
    "default": "",
    "cs_v2": true,
    "pptgen": true,
    "note": "호 양 끝 이름"
   },
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "gauge-arc"
  ]
 },
 "sample.chart-pair": {
  "group": "sample",
  "label": "견본: 막대 차트 2개(원본 내용 포함)",
  "emoji": "📉",
  "desc": "견본: 막대 차트 2개(원본 패턴의 내용 포함) — 회사 템플릿 견본.",
  "fields": {
   "title": "칸"
  },
  "status": "fallback",
  "shortcode": "stat-grid",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {},
  "args": {},
  "pptgen": {
   "status": "ready",
   "pattern": "c01-p19",
   "theme": "company-01"
  },
  "aliases": [
   "c01-p19"
  ]
 },
 "text.statement": {
  "group": "text",
  "label": "텍스트 전용(중앙 문장·요약·질문)",
  "emoji": "💬",
  "desc": "중앙에 큰 문장 하나(+보조 문장·요약 칩). 블록 없이 쓴 일반 문단과 같은 뜻.",
  "fields": {
   "title": "중앙 문장",
   "desc": "보조 문장",
   "meta": "요약 줄(｜ 구분)"
  },
  "status": "ready",
  "shortcode": "text.statement",
  "pptx_shortcode": "summary-box",
  "variants": [],
  "defaults": {},
  "args": {
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "text-only"
  ]
 },
 "text.body": {
  "group": "text",
  "label": "일반 문단·글머리(숏코드 없이 쓴 본문)",
  "emoji": "📄",
  "desc": "일반 문단·글머리 — 숏코드 없이 쓴 본문을 블록으로 쓸 때(bullet 이 있으면 글머리).",
  "fields": {
   "desc": "문단 또는 글머리 한 줄"
  },
  "status": "ready",
  "shortcode": "text.body",
  "pptx_shortcode": "summary-box",
  "variants": [],
  "defaults": {},
  "args": {
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": []
 },
 "text.quote": {
  "group": "text",
  "label": "인물 핵심 발언(얼굴·발언·하단 카드)",
  "emoji": "❝",
  "desc": "인물의 핵심 발언 — 이니셜 원·발언·출처, 아래 맥락 카드.",
  "fields": {
   "title": "발언",
   "meta": "시기·출처",
   "icon": "이니셜",
   "desc": "하단 카드"
  },
  "status": "ready",
  "shortcode": "text.quote",
  "pptx_shortcode": "takeaway-banner",
  "variants": [],
  "defaults": {},
  "args": {},
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "quote-hero"
  ]
 },
 "text.takeaway": {
  "group": "text",
  "label": "핵심 메시지 띠",
  "emoji": "💡",
  "desc": "강조하고 싶은 핵심 교훈이나 테이크어웨이 메시지를 한 줄 배너로 노출합니다.",
  "fields": {
   "icon": "아이콘",
   "title": "머리말",
   "desc": "메시지"
  },
  "status": "ready",
  "shortcode": "takeaway-banner",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {},
  "args": {
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "takeaway-banner",
   "takeaway"
  ]
 },
 "text.callout": {
  "group": "text",
  "label": "알림 상자(팁·주의·위험·정보)",
  "emoji": "⚠️",
  "desc": "팁·정보·주의·위험·성공 알림 상자. 종류는 첫 인수 또는 variant= (tip|info|warning|danger|success).",
  "fields": {
   "title": "제목",
   "desc": "내용",
   "color": "색"
  },
  "status": "ready",
  "shortcode": "alert-box",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {
   "variant": "tip"
  },
  "args": {
   "variant": {
    "values": "tip|info|warning|danger|success",
    "default": "tip",
    "cs_v2": true,
    "pptgen": true,
    "note": "warn·caution 은 warning 별칭. 첫 위치 인수로도 됨(::: text.callout tip)"
   },
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "alert-box"
  ]
 },
 "text.summary": {
  "group": "text",
  "label": "요약 상자(제목·설명·칩)",
  "emoji": "📝",
  "desc": "가이드 마지막 단에 배치하여 내용을 정리하고, 하단에 다량의 태그 칩을 덧붙입니다.",
  "fields": {
   "title": "제목",
   "desc": "설명",
   "meta": "칩(｜ 구분)"
  },
  "status": "ready",
  "shortcode": "summary-box",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {},
  "args": {
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "summary-box",
   "bottom-list"
  ]
 },
 "text.section": {
  "group": "text",
  "label": "구역 머리 띠(파트 표시)",
  "emoji": "🚩",
  "desc": "긴 문서나 슬라이드 중 단원/파트의 구분을 나누는 가로 대형 단막 배너입니다.",
  "fields": {
   "icon": "아이콘",
   "title": "구역 이름",
   "desc": "설명",
   "tag": "꼬리표"
  },
  "status": "ready",
  "shortcode": "part-banner",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {},
  "args": {
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "part-banner",
   "part-deck"
  ]
 },
 "text.icon-statement": {
  "group": "text",
  "label": "단일 아이콘 강조",
  "emoji": "💡",
  "desc": "큰 아이콘 하나와 문장 — 한 가지 메시지를 아이콘으로 강조.",
  "fields": {
   "icon": "아이콘",
   "title": "문장",
   "desc": "보조"
  },
  "status": "ready",
  "shortcode": "text.icon-statement",
  "pptx_shortcode": "takeaway-banner",
  "variants": [],
  "defaults": {},
  "args": {
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "icon-caption"
  ]
 },
 "text.avatar": {
  "group": "text",
  "label": "인물 이니셜 아바타(보조)",
  "emoji": "👤",
  "desc": "인물 이니셜 원 + 이름·소속(보조 요소).",
  "fields": {
   "icon": "이니셜",
   "title": "이름",
   "desc": "소속"
  },
  "status": "ready",
  "shortcode": "text.avatar",
  "pptx_shortcode": "summary-box",
  "variants": [],
  "defaults": {},
  "args": {},
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "initial-avatar"
  ]
 },
 "code.editor": {
  "group": "code",
  "label": "코드 편집기 창",
  "emoji": "🖥️",
  "desc": "코드 에디터 창(예: VS Code)의 외형을 흉내 낸 다크 에뮬레이터 블록입니다.",
  "fields": {
   "title": "파일 이름",
   "tag": "언어",
   "desc": "코드(여러 줄)"
  },
  "status": "ready",
  "shortcode": "editor-box",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {},
  "args": {
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "editor-box"
  ]
 },
 "code.console": {
  "group": "code",
  "label": "실행 결과 콘솔",
  "emoji": "💻",
  "desc": "시스템 명령어나 스크립트 실행 결과를 출력하는 콘솔화면 블록입니다.",
  "fields": {
   "title": "제목",
   "tag": "꼬리표",
   "desc": "출력(여러 줄)"
  },
  "status": "ready",
  "shortcode": "console-box",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {},
  "args": {
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "console-box"
  ]
 },
 "code.command": {
  "group": "code",
  "label": "명령 한 줄",
  "emoji": "⌨️",
  "desc": "실행해야 하는 명령어(CLI)를 안내하는 터미널 모형 박스입니다.",
  "fields": {
   "title": "설명",
   "tag": "셸",
   "desc": "명령"
  },
  "status": "ready",
  "shortcode": "cmd-box",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {},
  "args": {
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "cmd-box"
  ]
 },
 "nav.faq": {
  "group": "nav",
  "label": "질문·답변 목록",
  "emoji": "❓",
  "desc": "질문(title)과 그에 답하는 답변(desc) 형태의 아코디언 질문-답변 리스트입니다.",
  "fields": {
   "title": "질문",
   "desc": "답변"
  },
  "status": "ready",
  "shortcode": "faq-list",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {},
  "args": {
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "faq-list"
  ]
 },
 "nav.tabs": {
  "group": "nav",
  "label": "탭(같은 주제의 갈래별 내용)",
  "emoji": "📁",
  "desc": "Windows / macOS 등 플랫폼별 조치 방법이나 다중 탭을 리스트로 안내합니다.",
  "fields": {
   "title": "탭 이름",
   "desc": "내용"
  },
  "status": "ready",
  "shortcode": "os-tabs",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {},
  "args": {
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "os-tabs"
  ]
 },
 "nav.chapters": {
  "group": "nav",
  "label": "장 목록(번호·제목·설명·종류)",
  "emoji": "📚",
  "desc": "시리즈 부(Part) 하위에 속한 세부 챕터를 번호·제목·설명·구분 배지로 목록화합니다.",
  "fields": {
   "icon": "번호",
   "title": "제목",
   "desc": "설명",
   "tag": "종류(개념·도구·사례…)"
  },
  "status": "ready",
  "shortcode": "chapter-list",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {},
  "args": {
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "chapter-list"
  ]
 },
 "media.cards-image": {
  "group": "media",
  "label": "정보 카드 N + 이미지",
  "emoji": "🖼️",
  "desc": "정보 카드 N개 + 이미지(side 인수로 이미지 쪽). 항목 src 가 있으면 그 그림, 없으면 이미지 자리.",
  "fields": {
   "title": "카드 제목",
   "desc": "설명"
  },
  "status": "ready",
  "shortcode": "media.cards-image",
  "pptx_shortcode": "columns-grid",
  "variants": [],
  "defaults": {
   "side": "right"
  },
  "args": {
   "side": {
    "values": "left|right",
    "default": "right",
    "cs_v2": true,
    "pptgen": true,
    "note": "이미지 쪽"
   },
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "box-image-split"
  ]
 },
 "media.banner": {
  "group": "media",
  "label": "하단 이미지 배너",
  "emoji": "🖼️",
  "desc": "위 핵심 문장 두세 줄 + 아래 넓은 이미지 띠.",
  "fields": {
   "title": "글머리"
  },
  "status": "ready",
  "shortcode": "media.banner",
  "pptx_shortcode": "summary-box",
  "variants": [],
  "defaults": {},
  "args": {
   "bg": {
    "values": "base|alt",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "비우면 배치 고유 모양(대부분 base, pptgen 의 compare.pair·main-sub 왼쪽 칸·data.summary-bar 띠는 보조색). 이 블록의 카드 배경 — alt = 서식 세트의 보조 카드색(한 슬라이드에 카드 배경 2종). 항목 하나만이면 그 항목 tag: alt"
   },
   "title-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   },
   "desc-size": {
    "values": "비율(0.9) 또는 CSS 값",
    "default": "",
    "cs_v2": true,
    "pptgen": false,
    "note": "cs_v2 공통 — 카드 제목/설명 크기"
   }
  },
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "bottom-image-banner"
  ]
 },
 "media.full": {
  "group": "media",
  "label": "이미지 자리(전면)",
  "emoji": "🖼️",
  "desc": "본문 전체 이미지 자리 — desc 에 이미지 프롬프트, src 가 있으면 그림.",
  "fields": {
   "desc": "이미지 프롬프트"
  },
  "status": "ready",
  "shortcode": "media.full",
  "pptx_shortcode": "summary-box",
  "variants": [],
  "defaults": {},
  "args": {},
  "pptgen": {
   "status": "ready",
   "pattern": null,
   "theme": null
  },
  "aliases": [
   "placeholder"
  ]
 },
 "sample.infographic-2": {
  "group": "sample",
  "label": "견본: 2단 인포그래픽(원본 내용 포함)",
  "emoji": "🗺️",
  "desc": "견본: 2단 인포그래픽(원본 패턴의 내용 포함) — 회사 템플릿 견본.",
  "fields": {
   "title": "칸"
  },
  "status": "fallback",
  "shortcode": "grid.box-2",
  "pptx_shortcode": "summary-box",
  "variants": [],
  "defaults": {},
  "args": {},
  "pptgen": {
   "status": "ready",
   "pattern": "c01-p20",
   "theme": "company-01"
  },
  "aliases": [
   "c01-p20"
  ]
 }
};
export const LAYOUT_ALIASES = {
 "icon-grid": "grid.cards",
 "skill-list": "grid.cards",
 "checkpoint-grid": "grid.cards",
 "feature-grid": "grid.features",
 "badge-grid": "grid.badges",
 "tool-list": "grid.list",
 "tool-box": "grid.list",
 "plan-grid": "grid.tiers",
 "columns-grid": "grid.columns",
 "compare-grid": "grid.columns",
 "c01-p01": "grid.main-plus-3",
 "c01-p03": "grid.cards-icon-3",
 "c01-p04": "grid.wide-narrow-titled",
 "c01-p05": "grid.narrow-wide-titled",
 "c01-p11": "grid.box-1",
 "c01-p12": "grid.box-2",
 "c01-p13": "grid.box-3",
 "c01-p14": "grid.box-4",
 "c01-p15": "grid.narrow-wide",
 "c01-p16": "grid.wide-narrow",
 "c01-p17": "grid.circle-3",
 "c01-p18": "grid.band-box-3",
 "compare-split": "compare.pair",
 "split-2box": "compare.pair",
 "before-after": "compare.before-after",
 "compare-diff": "compare.before-after",
 "compare-before-after": "compare.before-after",
 "asymmetric-split": "compare.main-sub",
 "balance-beam": "compare.balance",
 "stacked-bars": "compare.hbars",
 "c01-p08": "compare.pair-summary",
 "step-flow": "process.track",
 "workflow-flow": "process.track",
 "workflow-strip": "process.track",
 "flow": "process.track",
 "flow-track": "process.track",
 "step-list": "process.steps",
 "staircase": "process.staircase",
 "level-grid": "process.levels",
 "git-flow": "process.branch",
 "git-flow-strip": "process.branch",
 "growth-panel": "process.growth",
 "triangle-cycle": "process.cycle-3",
 "zigzag-path": "process.zigzag",
 "c01-p02": "process.cards-arrow-4",
 "c01-p06": "process.input-circles-4",
 "c01-p07": "process.band-columns-3",
 "c01-p10": "process.steps-checklist-3",
 "network-box": "structure.hub",
 "hub-spoke": "structure.hub",
 "pillars-on-base": "structure.pillars",
 "concentric-rings": "structure.rings",
 "venn-diagram": "structure.venn",
 "venn": "structure.venn",
 "c01-p09": "structure.groups-2x3",
 "stat-grid": "data.stats",
 "stat-row": "data.stats",
 "summary-bar": "data.summary-bar",
 "bar-chart": "data.bars",
 "quadrant-chart": "data.quadrant",
 "gauge-arc": "data.gauge",
 "c01-p19": "sample.chart-pair",
 "text-only": "text.statement",
 "quote-hero": "text.quote",
 "takeaway-banner": "text.takeaway",
 "takeaway": "text.takeaway",
 "alert-box": "text.callout",
 "summary-box": "text.summary",
 "bottom-list": "text.summary",
 "part-banner": "text.section",
 "part-deck": "text.section",
 "icon-caption": "text.icon-statement",
 "initial-avatar": "text.avatar",
 "editor-box": "code.editor",
 "console-box": "code.console",
 "cmd-box": "code.command",
 "faq-list": "nav.faq",
 "os-tabs": "nav.tabs",
 "chapter-list": "nav.chapters",
 "box-image-split": "media.cards-image",
 "bottom-image-banner": "media.banner",
 "placeholder": "media.full",
 "c01-p20": "sample.infographic-2"
};
export const ALIAS_ARGS = {
 "skill-list": {
  "align": "left"
 },
 "checkpoint-grid": {
  "align": "row"
 },
 "compare-grid": {
  "variant": "plain"
 },
 "step-flow": {
  "connector": "none"
 },
 "flow": {
  "connector": "none"
 },
 "workflow-flow": {
  "connector": "arrow"
 },
 "workflow-strip": {
  "connector": "arrow"
 }
};
export const LAYOUT_EXAMPLES = {
 "grid.cards": {
  "args": "cols=3",
  "body": "- icon: \"🚀\"\n  title: \"빠른 퍼포먼스\"\n  desc: \"최적화된 빌드와 빌트인 파서 탑재\"\n- icon: \"🎨\"\n  title: \"디자인 테마 선택\"\n  desc: \"다양한 테마 조합 가능\"\n- icon: \"🧩\"\n  title: \"배치 라이브러리\"\n  desc: \"66종 배치를 같은 이름으로 사용\"",
  "more": [
   "align=left cols=2",
   "align=row"
  ]
 },
 "grid.features": {
  "args": "cols=2",
  "body": "- icon: \"⚡\"\n  title: \"실시간 미리보기\"\n  desc: \"수정 즉시 빌드 결과를 반영합니다.\"\n  tag: \"핵심\"\n- icon: \"📦\"\n  title: \"일괄 변환 기능\"\n  desc: \"전체 폴더를 원클릭으로 변환합니다.\"\n  tag: \"실무\""
 },
 "grid.badges": {
  "args": "",
  "body": "- icon: \"🌟\"\n  title: \"신속성\"\n  tag: \"Fast\"\n- icon: \"🔒\"\n  title: \"보안성\"\n  tag: \"Secure\"\n- icon: \"🧭\"\n  title: \"일관성\"\n  tag: \"Consistent\"\n- icon: \"🔧\"\n  title: \"확장성\"\n  tag: \"Extensible\""
 },
 "grid.list": {
  "args": "",
  "body": "- icon: \"🛠️\"\n  title: \"Vite\"\n  desc: \"초고속 프론트엔드 빌드 도구\"\n  meta: \"HMR 지원 | 플러그인 생태계\""
 },
 "grid.tiers": {
  "args": "",
  "body": "- title: \"Basic Plan\"\n  tag: \"Free\"\n  meta: \"기본 기능 제공 | 일간 10회 컴파일\"\n- title: \"Premium Plan\"\n  tag: \"Best\"\n  meta: \"모든 숏코드 지원 | 무제한 빌드 및 익스포트\"\n  featured: \"true\"\n  color: \"#3B82F6\""
 },
 "grid.columns": {
  "args": "cols=2",
  "body": "- title: \"ORM 사용\"\n  desc: \"빠른 개발 속도와 타입 안정성을 제공합니다.\"\n  note: \"복잡한 쿼리에서는 Raw SQL 병행 권장\"\n  color: \"#3b82f6\"\n- title: \"Raw SQL\"\n  desc: \"세밀한 쿼리 최적화가 가능합니다.\"",
  "more": [
   "variant=plain"
  ]
 },
 "grid.main-plus-3": {
  "args": "",
  "body": "- title: \"핵심 전략\"\n  meta: \"AI 우선 설계 | 데이터 기반 의사결정\"\n- title: \"실행 체계\"\n  meta: \"전담 조직 | 분기별 점검\"\n- title: \"확산 방안\"\n  meta: \"사례 공유 | 교육 확대\""
 },
 "grid.cards-icon-3": {
  "args": "",
  "body": "- title: \"구축\"\n  desc: \"AI 개발 플랫폼\"\n  meta: \"슈퍼컴퓨팅 | 기밀 컴퓨팅\"\n- title: \"결합\"\n  desc: \"멀티에이전트\"\n  meta: \"특화 모델 | 피지컬 AI\"\n- title: \"신뢰\"\n  desc: \"선제적 보안\"\n  meta: \"출처 검증 | 보안 플랫폼\""
 },
 "grid.wide-narrow-titled": {
  "args": "",
  "body": "- title: \"현황\"\n  meta: \"도입 기업 증가 | 활용 범위 확대 | 투자 확대\"\n- title: \"과제\"\n  meta: \"전문 인력 | 데이터 품질\""
 },
 "grid.narrow-wide-titled": {
  "args": "",
  "body": "- title: \"목표\"\n  meta: \"업무 자동화 30%\"\n- title: \"추진 방안\"\n  meta: \"업무 진단 | 시범 적용 | 전사 확산\""
 },
 "grid.box-1": {
  "args": "",
  "body": "- title: \"핵심 메시지\"\n  meta: \"AI 경쟁력은 모델 성능만이 아니라 구축·실행·통제를 함께 설계하는 데서 나온다\""
 },
 "grid.box-2": {
  "args": "",
  "body": "- title: \"기회\"\n  meta: \"생산성 향상 | 새 서비스\"\n- title: \"위험\"\n  meta: \"보안 사고 | 품질 편차\""
 },
 "grid.box-3": {
  "args": "",
  "body": "- title: \"사람\"\n  meta: \"역량 교육 | 역할 재설계\"\n- title: \"프로세스\"\n  meta: \"업무 진단 | 자동화\"\n- title: \"기술\"\n  meta: \"플랫폼 | 데이터\""
 },
 "grid.box-4": {
  "args": "",
  "body": "- title: \"계획\"\n  meta: \"목표 설정\"\n- title: \"실행\"\n  meta: \"시범 적용\"\n- title: \"점검\"\n  meta: \"성과 측정\"\n- title: \"개선\"\n  meta: \"확산·보완\""
 },
 "grid.narrow-wide": {
  "args": "",
  "body": "- title: \"요약\"\n  meta: \"세 가지 축\"\n- title: \"설명\"\n  meta: \"구축 기반 | 지능형 결합 | 보안·신뢰\""
 },
 "grid.wide-narrow": {
  "args": "",
  "body": "- title: \"설명\"\n  meta: \"구축 기반 | 지능형 결합 | 보안·신뢰\"\n- title: \"요약\"\n  meta: \"세 가지 축\""
 },
 "grid.circle-3": {
  "args": "",
  "body": "- title: \"구축\"\n- title: \"결합\"\n- title: \"신뢰\""
 },
 "grid.band-box-3": {
  "args": "header=\"구축 기반 → 지능형 실행 → 보안·신뢰·주권\"",
  "body": "- title: \"THE ARCHITECT · 구축 기반\"\n  meta: \"AI 네이티브 개발 플랫폼 | AI 슈퍼컴퓨팅 플랫폼 | 기밀 컴퓨팅\"\n- title: \"THE SYNTHESIST · 지능형 결합\"\n  meta: \"멀티에이전트 시스템 | 도메인 특화 언어 모델 | 피지컬 AI\"\n- title: \"THE VANGUARD · 보안·신뢰·주권\"\n  meta: \"선제적 사이버 보안 | 디지털 출처 검증 | AI 보안 플랫폼\""
 },
 "compare.pair": {
  "args": "",
  "body": "- title: \"Before\"\n  desc: \"기존 수동 렌더링\"\n  meta: \"수동 HTML 태그 관리 | 스타일 일관성 부족\"\n- title: \"After\"\n  desc: \"V2 자동 숏코드\"\n  meta: \"마크다운 기반 시각화 | 동적 높이 및 일관성\""
 },
 "compare.before-after": {
  "args": "",
  "body": "- title: \"AS-IS 구형 방식\"\n  desc: \"수동으로 서버에 SSH 접속하여 파일을 업로드했습니다.\"\n- title: \"TO-BE 개선 방식\"\n  desc: \"커밋 하나로 CI/CD 자동 빌드·배포가 실행됩니다.\""
 },
 "compare.main-sub": {
  "args": "ratio=0.66",
  "body": "- title: 핵심 전략\n  desc: 모델이 아니라 시스템으로 경쟁한다\n  meta: 구축 | 연결 | 신뢰\n- title: 보조\n  desc: 단기 과제"
 },
 "compare.balance": {
  "args": "",
  "body": "- title: 속도\n  desc: 빠르게 도입한다\n- title: 안전\n  desc: 위험을 통제한다"
 },
 "compare.hbars": {
  "args": "emphasis=last",
  "body": "- title: 챗봇\n  desc: 질문에 답만 한다\n- title: 코파일럿\n  desc: 사람 옆에서 돕는다\n- title: 에이전트\n  desc: 목표만 주면 스스로 실행한다"
 },
 "compare.pair-summary": {
  "args": "header=\"도입 전과 후\"",
  "body": "- title: \"도입 전\"\n  desc: \"수작업 중심\"\n- title: \"도입 후\"\n  desc: \"자동화 중심\""
 },
 "process.track": {
  "args": "",
  "body": "- icon: \"👨\"\n  title: \"요구사항 정의\"\n  desc: \"기능 정의 및 범위 확정\"\n  meta: \"회의록 작성\"\n  tag: \"active\"\n- icon: \"💻\"\n  title: \"시나리오 설계\"\n  desc: \"동선 및 와이어프레임 설계\"\n  meta: \"Figma\"",
  "more": [
   "connector=arrow emphasis=last",
   "badge=number connector=none"
  ]
 },
 "process.steps": {
  "args": "",
  "body": "- title: \"문서 선택\"\n  desc: \"가이드 문서를 로드하거나 새로 작성합니다.\"\n- title: \"숏코드 편집\"\n  desc: \"필요한 시각화 숏코드를 삽입하고 옵션을 조절합니다.\""
 },
 "process.staircase": {
  "args": "grow=1.5 caption=\"세대 전환 간격이 짧아졌다\"",
  "body": "- title: 챗봇\n  desc: 질문에 답한다\n  meta: 2022\n- title: 추론자\n  desc: 단계적으로 푼다\n  meta: 2024\n- title: 에이전트\n  desc: 스스로 실행한다\n  meta: 2026",
  "more": [
   "grow=1.5 caption=\"세대 전환 간격이 짧아졌다\"",
   "grow=1.1"
  ]
 },
 "process.levels": {
  "args": "",
  "body": "- title: \"입문\"\n  desc: \"기본 문법과 핵심 개념 이해\"\n- title: \"중급\"\n  desc: \"실무 프로젝트 적용 가능\"\n  tag: \"highlight\"\n- title: \"고급\"\n  desc: \"아키텍처 설계 및 최적화 수행\"",
  "more": [
   "grow=1.2 emphasis=last"
  ]
 },
 "process.branch": {
  "args": "",
  "body": "- title: \"main\"\n  tag: \"v2.0.0\"\n  meta: \"초기 버전 | 패치 배포\"\n  color: \"#10B981\"\n- title: \"dev\"\n  tag: \"develop\"\n  meta: \"신규 기능 추가 | 버그 수정\"\n  color: \"#3B82F6\""
 },
 "process.growth": {
  "args": "",
  "body": "- icon: 1억\n  title: 2023 사용자\n- icon: 8억\n  title: 2026 사용자"
 },
 "process.cycle-3": {
  "args": "",
  "body": "- title: 기록\n  desc: 데이터를 모은다\n- title: 학습\n  desc: 모델을 개선한다\n- title: 적용\n  desc: 현장에 쓴다"
 },
 "process.zigzag": {
  "args": "",
  "body": "- title: 도입\n- title: 확산\n- title: 정착\n- title: 고도화\n- title: 혁신"
 },
 "process.cards-arrow-4": {
  "args": "",
  "body": "- title: \"진단\"\n  desc: \"업무 분석\"\n  meta: \"인터뷰 | 데이터 수집 | 병목 파악 | 우선순위\"\n- title: \"설계\"\n  desc: \"모델 선정\"\n  meta: \"요구사항 | 아키텍처 | 보안 검토 | 예산\"\n- title: \"구축\"\n  desc: \"시범 적용\"\n  meta: \"개발 | 연동 | 테스트 | 교육\"\n- title: \"확산\"\n  desc: \"전사 적용\"\n  meta: \"운영 | 모니터링 | 개선 | 공유\""
 },
 "process.input-circles-4": {
  "args": "",
  "body": "- title: \"1단계\"\n  desc: \"수집\"\n  meta: \"원천 데이터 | 정제 | 저장\"\n- title: \"2단계\"\n  desc: \"분석\"\n  meta: \"패턴 | 예측 | 시각화\"\n- title: \"3단계\"\n  desc: \"적용\"\n  meta: \"자동화 | 추천 | 알림\"\n- title: \"4단계\"\n  desc: \"개선\"\n  meta: \"피드백 | 재학습 | 확산\""
 },
 "process.band-columns-3": {
  "args": "header=\"세 가지 변화\"",
  "body": "- title: \"업무\"\n  desc: \"1\"\n  meta: \"수작업 | 자동화 | 개인 경험 | 데이터 근거 | 느린 처리 | 실시간 처리\"\n- title: \"조직\"\n  desc: \"2\"\n  meta: \"부서 단위 | 협업 단위 | 위계 | 역할 | 연간 계획 | 상시 조정\"\n- title: \"고객\"\n  desc: \"3\"\n  meta: \"일괄 응대 | 맞춤 응대 | 대기 | 즉시 | 사후 대응 | 선제 대응\""
 },
 "process.steps-checklist-3": {
  "args": "header=\"도입 3단계\"",
  "body": "- title: \"준비\"\n  desc: \"1\"\n  meta: \"목표 설정 | 데이터 점검\"\n- title: \"시범\"\n  desc: \"2\"\n  meta: \"한 부서 적용 | 성과 측정\"\n- title: \"확산\"\n  desc: \"3\"\n  meta: \"전사 적용 | 운영 체계\""
 },
 "structure.hub": {
  "args": "",
  "body": "- title: \"중앙 핵심 개념\"\n  color: \"#EC4899\"\n- title: \"연결 개념 A\"\n  meta: \"세부 관계\"\n- title: \"연결 개념 B\"\n  meta: \"세부 관계\""
 },
 "structure.pillars": {
  "args": "",
  "body": "- title: 데이터 기반\n- title: 개발\n- title: 운영\n- title: 보안"
 },
 "structure.rings": {
  "args": "",
  "body": "- title: \"AI\"\n  color: \"#94A3B8\"\n- title: \"머신러닝\"\n  color: \"#64748B\"\n- title: \"딥러닝\"\n  color: \"#475569\"\n- title: \"LLM\"\n  icon: \"🧠\"\n  color: \"#1E293B\""
 },
 "structure.venn": {
  "args": "",
  "body": "- title: \"전공 A\"\n  color: \"#6366F1\"\n- title: \"전공 B\"\n  color: \"#EC4899\"\n- icon: \"⭐\"\n  desc: \"새로운 가치\""
 },
 "structure.groups-2x3": {
  "args": "",
  "body": "- title: \"내부 역량\"\n  desc: \"사람과 조직\"\n  meta: \"교육 | 인재 | 문화 | 리더십\"\n- title: \"외부 협력\"\n  desc: \"생태계\"\n  meta: \"파트너 | 공급망 | 학계 | 정부\""
 },
 "data.stats": {
  "args": "",
  "body": "- icon: \"99.9%\"\n  title: \"가동 시간\"\n  desc: \"평균 가동률\"\n- icon: \"120ms\"\n  title: \"응답 지연\"\n  desc: \"API 응답 지연\"",
  "more": [
   "bg=alt"
  ]
 },
 "data.summary-bar": {
  "args": "",
  "body": "- icon: \"25종\"\n  title: \"핵심 숏코드\"\n- icon: \"38종\"\n  title: \"alias 포함 지원 규격\""
 },
 "data.bars": {
  "args": "",
  "body": "- title: 전화기\n  icon: 75년\n- title: 인터넷\n  icon: 7년\n- title: 챗GPT\n  icon: 2개월\n  tag: highlight"
 },
 "data.quadrant": {
  "args": "xLabel=\"가격\" yLabel=\"품질\"",
  "body": "- title: \"제품 A\"\n  fx: \"0.3\"\n  fy: \"0.7\"\n  color: \"#6366F1\"\n- title: \"제품 B\"\n  fx: \"0.8\"\n  fy: \"0.2\"\n  color: \"#EC4899\""
 },
 "data.gauge": {
  "args": "left=\"신중\" right=\"낙관\"",
  "body": "- title: 학계\n  icon: 30\n- title: 산업계\n  icon: 75"
 },
 "sample.chart-pair": {
  "args": "",
  "body": "- title: \"AI 시장은 연평균 35% 이상 성장\"\n  desc: \"AI 시장 규모 전망\"\n  meta: \"2.5조 달러 | 13.5배 성장 | 0.18조 달러 | 2033 | 2024 | * 출처 예시\"\n- title: \"도입 기업은 2년 새 두 배\"\n  desc: \"AI 도입 기업 비율\"\n  meta: \"72% | 2배 | 35% | 2025 | 2023 | * 출처 예시\""
 },
 "text.statement": {
  "args": "",
  "body": "- title: 모델이 아니라 시스템이 경쟁력이다\n  desc: 구축 · 실행 · 신뢰를 함께 설계한다\n  meta: 구축 | 실행 | 신뢰"
 },
 "text.body": {
  "args": "",
  "body": "- desc: \"블록 밖에 쓴 일반 문단은 이 배치로 그린다.\"\n- desc: \"글머리로 쓴 줄은 글머리로 남는다.\"\n  bullet: \"y\""
 },
 "text.quote": {
  "args": "",
  "body": "- title: 우리는 모델이 아니라 시스템을 만든다\n  meta: 2026.10 · 기조연설\n  icon: DA\n- title: 맥락\n  desc: 에이전트 시대의 경쟁\n- title: 의미\n  desc: 통합 설계가 핵심"
 },
 "text.takeaway": {
  "args": "",
  "body": "- icon: \"💡\"\n  title: \"Key Takeaway\"\n  desc: \"숏코드의 진정한 가치는 텍스트 정보의 시각적 컴포넌트 자동화에 있습니다.\""
 },
 "text.callout": {
  "args": "tip",
  "body": "- title: \"작성 팁\"\n  desc: \"기본 본문은 desc 속성 하위에서 작성해 주세요.\"",
  "more": [
   "warning",
   "success"
  ]
 },
 "text.summary": {
  "args": "",
  "body": "- title: \"요약정리\"\n  desc: \"시각화 숏코드를 활용하면 핵심 개념을 직관적으로 전달할 수 있습니다.\"\n  meta: \"25종 숏코드 | HTML 연동 | PPTX 연동\""
 },
 "text.section": {
  "args": "",
  "body": "- icon: \"2부\"\n  title: \"핵심 가이드 마스터\"\n  desc: \"V2.0에서 강화된 숏코드로 다양한 웹/PPTX 변환 실무 적용하기\"\n  tag: \"Ch.10 - 20\""
 },
 "text.icon-statement": {
  "args": "",
  "body": "- icon: robot\n  title: 에이전트가 일을 끝낸다\n  desc: 사람은 목표와 검토에 집중한다"
 },
 "text.avatar": {
  "args": "",
  "body": "- icon: SH\n  title: 신○○\n  desc: 정보통신산업진흥원"
 },
 "code.editor": {
  "args": "",
  "body": "- title: \"filename.js\"\n  tag: \"javascript\"\n  desc: |\n    // 코드 내용\n    console.log(\"Hello, World!\");"
 },
 "code.console": {
  "args": "",
  "body": "- title: \"가이드 생성 결과\"\n  desc: |\n    [System] build-guide.mjs 빌드 완료\n    [Success] C:\\ai\\cs_v2\\publish\\index.html 생성 성공!"
 },
 "code.command": {
  "args": "",
  "body": "- title: \"V2 서버 구동\"\n  tag: \"bash\"\n  desc: \"npm run dev\""
 },
 "nav.faq": {
  "args": "",
  "body": "- title: \"Q. 숏코드가 정상적으로 렌더링되지 않아요.\"\n  desc: \"A. 숏코드 내부 인덴트(여백)나 문법이 V2 규격(::: 숏코드명)과 일치하는지 확인하십시오.\"\n- title: \"Q. pptgen 과 cs_v2 에 같은 md 를 써도 되나요?\"\n  desc: \"A. 네. 형식 v2 는 두 도구가 변환 없이 같은 배치 이름으로 읽습니다.\""
 },
 "nav.tabs": {
  "args": "",
  "body": "- title: \"Windows\"\n  desc: \"Windows OS의 설정 가이드 내용을 마크다운으로 기술합니다.\"\n- title: \"macOS\"\n  desc: \"macOS용 단축키 및 실행 명령어 가이드를 작성합니다.\""
 },
 "nav.chapters": {
  "args": "",
  "body": "- icon: \"01\"\n  title: \"시스템 개요\"\n  desc: \"전체 아키텍처와 핵심 구성 요소를 소개합니다.\"\n  tag: \"개념\"\n- icon: \"02\"\n  title: \"빠른 시작 가이드\"\n  desc: \"설치부터 첫 빌드까지 단계별로 안내합니다.\"\n  tag: \"실습\""
 },
 "media.cards-image": {
  "args": "",
  "body": "- title: 현장 적용\n  desc: 공장·물류\n- title: 사무 적용\n  desc: 문서·메일"
 },
 "media.banner": {
  "args": "",
  "body": "- title: 이미지가 주인공인 슬라이드\n- title: 위에는 핵심 문장 두세 줄"
 },
 "media.full": {
  "args": "",
  "body": "- title: \"현장 사진\"\n  desc: \"a wide photo of a modern factory floor with collaborative robots, natural light\""
 },
 "sample.infographic-2": {
  "args": "",
  "body": "- title: \"지역 디지털 혁신 확산\"\n  desc: \"기술 중심 생태계\"\n  meta: \"거점 확산과 대규모 프로젝트 | 전북 | 대구 | 광주 | 경남 | 권역별 강점 산업 | 지역 특화 실증\"\n- title: \"산업별 AX 확대\"\n  desc: \"업종 맞춤 지원\"\n  meta: \"제조·물류·농업 실증 | 제조 | 물류 | 농업 | 조선 | 업종별 모델 | 신사업 발굴\""
 }
};
export const SHAPE_SETS = {
 "schema": 1,
 "_doc": "공용 서식 세트(도형 서식 층) — pptgen 과 cs_v2 가 같은 이름으로 카드의 채움·보조 카드색·외곽선·그림자·둥글기를 고른다. 세트는 '모양'만 정하고 색은 테마 색 이름(tokens)으로만 가리킨다 → 테마를 바꾸면 같은 세트가 그 테마 색으로 다시 칠해진다(테마와 따로 놀지 않는다). 'template' 은 테마(회사 템플릿 등)가 가진 원래 서식을 그대로 쓴다는 뜻 — 기본값. 고르는 곳: 머리말/조합 shape=<세트>, 블록 인수 bg=alt(보조 카드색), 항목 tag: alt. 규칙: catalog/README.md '서식 세트'.",
 "updated": "2026-10-14",
 "default": "template",
 "tokens": {
  "_doc": "세트가 쓰는 색 이름 → 매체별 실제 색. pptgen = 테마 팔레트 키(왼쪽이 없으면 \"|\" 뒤), cs_v2 = CSS 값(테마 변수 기반 — 다크/라이트 셸 모두에서 읽히도록 카드 바탕 var(--card-bg) 에 섞는다), cs_v2_pptx = cs_v2 PPTX 팔레트 키(md-to-pptx makePalette).",
  "white": {
   "pptgen": "white",
   "cs_v2": "var(--card-bg, #fff)",
   "cs_v2_pptx": "white"
  },
  "surface": {
   "pptgen": "cardBg",
   "cs_v2": "color-mix(in srgb, var(--text, #1A1A2E) 4%, var(--card-bg, #fff))",
   "cs_v2_pptx": "bgLight"
  },
  "primary": {
   "pptgen": "main",
   "cs_v2": "var(--brand)",
   "cs_v2_pptx": "brand"
  },
  "secondary": {
   "pptgen": "sub",
   "cs_v2": "var(--brand-dark)",
   "cs_v2_pptx": "brandDark"
  },
  "primary-light": {
   "pptgen": "lightMain|cardBg",
   "cs_v2": "color-mix(in srgb, var(--brand) 10%, var(--card-bg, #fff))",
   "cs_v2_pptx": "brandLight"
  },
  "secondary-light": {
   "pptgen": "lightSub|cardBg",
   "cs_v2": "color-mix(in srgb, var(--brand-dark) 6%, var(--card-bg, #fff))",
   "cs_v2_pptx": "bgLight"
  },
  "accent-light": {
   "pptgen": "lightAccent2|cardBg",
   "cs_v2": "color-mix(in srgb, var(--brand) 16%, var(--card-bg, #fff))",
   "cs_v2_pptx": "brandLight"
  },
  "border": {
   "pptgen": "lightMain|gray",
   "cs_v2": "var(--border)",
   "cs_v2_pptx": "border"
  },
  "ink": {
   "pptgen": "textDark",
   "cs_v2": "var(--text)",
   "cs_v2_pptx": "text"
  }
 },
 "radius": {
  "none": {
   "in": 0,
   "px": 0
  },
  "sm": {
   "in": 0.06,
   "px": 6
  },
  "md": {
   "in": 0.14,
   "px": 12
  },
  "lg": {
   "in": 0.24,
   "px": 20
  }
 },
 "shadow": {
  "none": null,
  "soft": {
   "blur_pt": 10,
   "dist_pt": 3,
   "alpha": 0.12,
   "css": "0 3px 10px rgba(0,0,0,0.10)"
  },
  "medium": {
   "blur_pt": 16,
   "dist_pt": 5,
   "alpha": 0.18,
   "css": "0 6px 18px rgba(0,0,0,0.14)"
  },
  "strong": {
   "blur_pt": 24,
   "dist_pt": 8,
   "alpha": 0.24,
   "css": "0 10px 30px rgba(0,0,0,0.20)"
  }
 },
 "sets": {
  "template": {
   "label": "테마 원래 서식(회사 템플릿 등 — 기본). 외곽선·그림자·둥글기는 테마 그대로, 보조 카드색만 card_alt 로 정한다",
   "inherit": true,
   "card_alt": {
    "fill": "secondary-light"
   }
  },
  "flat": {
   "label": "평면 — 얇은 외곽선, 그림자 없음",
   "card": {
    "fill": "white",
    "radius": "sm"
   },
   "card_alt": {
    "fill": "primary-light"
   },
   "outline": {
    "width_pt": 0.75,
    "color": "border"
   },
   "shadow": "none"
  },
  "soft": {
   "label": "부드러운 그림자 — 외곽선 없음",
   "card": {
    "fill": "white",
    "radius": "md"
   },
   "card_alt": {
    "fill": "secondary-light"
   },
   "outline": {
    "width_pt": 0,
    "color": "border"
   },
   "shadow": "soft"
  },
  "outline": {
   "label": "윤곽 강조 — 대표색 외곽선",
   "card": {
    "fill": "white",
    "radius": "md"
   },
   "card_alt": {
    "fill": "primary-light"
   },
   "outline": {
    "width_pt": 1.5,
    "color": "primary"
   },
   "shadow": "none"
  },
  "elevated": {
   "label": "떠 있는 카드 — 큰 그림자",
   "card": {
    "fill": "white",
    "radius": "lg"
   },
   "card_alt": {
    "fill": "surface"
   },
   "outline": {
    "width_pt": 0,
    "color": "border"
   },
   "shadow": "medium"
  },
  "tinted": {
   "label": "옅은 색 카드 — 대표색 옅은 바탕",
   "card": {
    "fill": "primary-light",
    "radius": "md"
   },
   "card_alt": {
    "fill": "secondary-light"
   },
   "outline": {
    "width_pt": 0,
    "color": "border"
   },
   "shadow": "none"
  }
 }
};
export const COLOR_TOKENS = {
 "_doc": "항목 color 에 쓰는 색 이름 → 매체별 실제 색. 같은 이름이면 pptgen·cs_v2 가 같은 역할의 테마 색을 쓴다. #hex 도 허용. pptgen = 테마 팔레트 키, cs_v2 = CSS 값, cs_v2_pptx = cs_v2 PPTX 팔레트 키.",
 "primary": {
  "pptgen": "main",
  "cs_v2": "var(--brand)",
  "cs_v2_pptx": "brand",
  "aliases": [
   "main",
   "brand"
  ]
 },
 "secondary": {
  "pptgen": "sub",
  "cs_v2": "var(--brand-dark)",
  "cs_v2_pptx": "brandDark",
  "aliases": [
   "sub",
   "brand-dark",
   "branddark"
  ]
 },
 "accent": {
  "pptgen": "accent1",
  "cs_v2": "var(--brand-mid)",
  "cs_v2_pptx": "brandMid",
  "aliases": [
   "accent1",
   "mid",
   "brand-mid",
   "brandmid"
  ]
 },
 "accent2": {
  "pptgen": "accent2",
  "cs_v2": "var(--brand-deep)",
  "cs_v2_pptx": "brandDeep",
  "aliases": [
   "deep",
   "brand-deep",
   "branddeep"
  ]
 },
 "light": {
  "pptgen": "lightMain",
  "cs_v2": "var(--brand-light)",
  "cs_v2_pptx": "brandLight",
  "aliases": [
   "brand-light",
   "brandlight"
  ]
 },
 "dark": {
  "pptgen": "dark",
  "cs_v2": "var(--text)",
  "cs_v2_pptx": "text",
  "aliases": []
 },
 "ink": {
  "pptgen": "textDark",
  "cs_v2": "var(--text)",
  "cs_v2_pptx": "text",
  "aliases": []
 },
 "gray": {
  "pptgen": "gray",
  "cs_v2": "var(--text-3)",
  "cs_v2_pptx": "muted",
  "aliases": []
 }
};
export const LAYOUT_FALLBACK = {
 "_doc": "구현 상태가 markdown·none 인 배치를 블록(:::)으로 썼을 때 대신 그릴 것. cs_v2 = 숏코드 이름(제목·설명·meta 목록을 그대로 보여 주는 것)",
 "cs_v2": "summary-box"
};
