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
   "cols": "항목 수에 맞춤",
   "align": "center",
   "badge": "icon",
   "bg": "base"
  }
 },
 "grid.features": {
  "group": "grid",
  "label": "기능 카드(제목·태그·설명)",
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
  "defaults": {
   "cols": "항목 수에 맞춤",
   "bg": "base"
  }
 },
 "grid.badges": {
  "group": "grid",
  "label": "작은 칩 묶음(이름·꼬리표)",
  "fields": {
   "icon": "아이콘",
   "title": "이름",
   "tag": "꼬리표"
  },
  "status": "ready",
  "shortcode": "badge-grid",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {
   "cols": "항목 수에 맞춤",
   "bg": "base"
  }
 },
 "grid.list": {
  "group": "grid",
  "label": "머리띠 목록 카드(이름·설명·글머리)",
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
  "defaults": {
   "bg": "base"
  }
 },
 "grid.tiers": {
  "group": "grid",
  "label": "등급·선택지 카드(강조 1개)",
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
  "defaults": {
   "cols": "항목 수에 맞춤",
   "bg": "base"
  }
 },
 "grid.columns": {
  "group": "grid",
  "label": "다단 정보 카드(제목·설명·팁)",
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
   "cols": "항목 수에 맞춤",
   "bg": "base",
   "variant": "card"
  }
 },
 "grid.main-plus-3": {
  "group": "grid",
  "label": "큰 칸 1 + 세로 작은 칸 3",
  "fields": {
   "title": "소제목(상자 첫 줄)",
   "meta": "글머리(｜ 구분)",
   "desc": "글머리로 이어 붙임"
  },
  "status": "ready",
  "shortcode": "grid.main-plus-3",
  "pptx_shortcode": "columns-grid",
  "variants": [],
  "defaults": {}
 },
 "grid.cards-icon-3": {
  "group": "grid",
  "label": "카드 3열(알약 제목·원·설명)",
  "fields": {
   "title": "소제목(상자 첫 줄)",
   "meta": "글머리(｜ 구분)",
   "desc": "글머리로 이어 붙임"
  },
  "status": "ready",
  "shortcode": "grid.cards-icon-3",
  "pptx_shortcode": "columns-grid",
  "variants": [],
  "defaults": {}
 },
 "grid.wide-narrow-titled": {
  "group": "grid",
  "label": "넓은 칸 + 좁은 칸(알약 제목)",
  "fields": {
   "title": "소제목(상자 첫 줄)",
   "meta": "글머리(｜ 구분)",
   "desc": "글머리로 이어 붙임"
  },
  "status": "ready",
  "shortcode": "grid.wide-narrow-titled",
  "pptx_shortcode": "columns-grid",
  "variants": [],
  "defaults": {}
 },
 "grid.narrow-wide-titled": {
  "group": "grid",
  "label": "좁은 칸 + 넓은 칸(알약 제목)",
  "fields": {
   "title": "소제목(상자 첫 줄)",
   "meta": "글머리(｜ 구분)",
   "desc": "글머리로 이어 붙임"
  },
  "status": "ready",
  "shortcode": "grid.narrow-wide-titled",
  "pptx_shortcode": "columns-grid",
  "variants": [],
  "defaults": {}
 },
 "grid.box-1": {
  "group": "grid",
  "label": "빈 상자 1(본문 전체)",
  "fields": {
   "title": "소제목(상자 첫 줄)",
   "meta": "글머리(｜ 구분)",
   "desc": "글머리로 이어 붙임"
  },
  "status": "ready",
  "shortcode": "grid.box-1",
  "pptx_shortcode": "columns-grid",
  "variants": [],
  "defaults": {}
 },
 "grid.box-2": {
  "group": "grid",
  "label": "빈 상자 2 균등",
  "fields": {
   "title": "소제목(상자 첫 줄)",
   "meta": "글머리(｜ 구분)",
   "desc": "글머리로 이어 붙임"
  },
  "status": "ready",
  "shortcode": "grid.box-2",
  "pptx_shortcode": "columns-grid",
  "variants": [],
  "defaults": {}
 },
 "grid.box-3": {
  "group": "grid",
  "label": "빈 상자 3 균등",
  "fields": {
   "title": "소제목(상자 첫 줄)",
   "meta": "글머리(｜ 구분)",
   "desc": "글머리로 이어 붙임"
  },
  "status": "ready",
  "shortcode": "grid.box-3",
  "pptx_shortcode": "columns-grid",
  "variants": [],
  "defaults": {}
 },
 "grid.box-4": {
  "group": "grid",
  "label": "빈 상자 4 균등",
  "fields": {
   "title": "소제목(상자 첫 줄)",
   "meta": "글머리(｜ 구분)",
   "desc": "글머리로 이어 붙임"
  },
  "status": "ready",
  "shortcode": "grid.box-4",
  "pptx_shortcode": "columns-grid",
  "variants": [],
  "defaults": {}
 },
 "grid.narrow-wide": {
  "group": "grid",
  "label": "좁은 칸 + 넓은 칸",
  "fields": {
   "title": "소제목(상자 첫 줄)",
   "meta": "글머리(｜ 구분)",
   "desc": "글머리로 이어 붙임"
  },
  "status": "ready",
  "shortcode": "grid.narrow-wide",
  "pptx_shortcode": "columns-grid",
  "variants": [],
  "defaults": {}
 },
 "grid.wide-narrow": {
  "group": "grid",
  "label": "넓은 칸 + 좁은 칸",
  "fields": {
   "title": "소제목(상자 첫 줄)",
   "meta": "글머리(｜ 구분)",
   "desc": "글머리로 이어 붙임"
  },
  "status": "ready",
  "shortcode": "grid.wide-narrow",
  "pptx_shortcode": "columns-grid",
  "variants": [],
  "defaults": {}
 },
 "grid.circle-3": {
  "group": "grid",
  "label": "큰 원 3",
  "fields": {
   "title": "소제목(상자 첫 줄)",
   "meta": "글머리(｜ 구분)",
   "desc": "글머리로 이어 붙임"
  },
  "status": "ready",
  "shortcode": "grid.circle-3",
  "pptx_shortcode": "columns-grid",
  "variants": [],
  "defaults": {}
 },
 "grid.band-box-3": {
  "group": "grid",
  "label": "머리띠 + 상자 3",
  "fields": {
   "title": "소제목(상자 첫 줄)",
   "meta": "글머리(｜ 구분)",
   "desc": "글머리로 이어 붙임"
  },
  "status": "ready",
  "shortcode": "grid.band-box-3",
  "pptx_shortcode": "columns-grid",
  "variants": [],
  "defaults": {}
 },
 "compare.pair": {
  "group": "compare",
  "label": "좌우 2단 비교(제목·설명·글머리)",
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
  "defaults": {
   "bg": "base"
  }
 },
 "compare.before-after": {
  "group": "compare",
  "label": "전·후 대조(❌ → ✅)",
  "fields": {
   "title": "상태 이름",
   "desc": "설명"
  },
  "status": "ready",
  "shortcode": "before-after",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {
   "bg": "base"
  }
 },
 "compare.main-sub": {
  "group": "compare",
  "label": "비대칭 2분할(주 / 부)",
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
   "ratio": "0.64",
   "bg": "base"
  }
 },
 "compare.balance": {
  "group": "compare",
  "label": "천칭 균형 비교",
  "fields": {
   "icon": "아이콘",
   "title": "쪽 이름",
   "desc": "설명"
  },
  "status": "ready",
  "shortcode": "compare.balance",
  "pptx_shortcode": "compare-split",
  "variants": [],
  "defaults": {
   "bg": "base"
  }
 },
 "compare.hbars": {
  "group": "compare",
  "label": "가로 막대 스택 비교",
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
   "emphasis": "none",
   "bg": "base"
  }
 },
 "compare.pair-summary": {
  "group": "compare",
  "label": "좌우 비교 + 하단 결론 띠",
  "fields": {
   "title": "칸 이름(알약)",
   "desc": "설명",
   "meta": "글머리(｜ 구분)"
  },
  "status": "ready",
  "shortcode": "compare.pair-summary",
  "pptx_shortcode": "compare-split",
  "variants": [],
  "defaults": {}
 },
 "process.track": {
  "group": "process",
  "label": "단계 흐름(아이콘 노드·연결)",
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
   "emphasis": "none",
   "bg": "base"
  }
 },
 "process.steps": {
  "group": "process",
  "label": "번호 단계 목록(세로)",
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
   "badge": "number",
   "bg": "base"
  }
 },
 "process.staircase": {
  "group": "process",
  "label": "계단식 단계(뒤로 갈수록 높아짐)",
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
   "emphasis": "last",
   "bg": "base"
  }
 },
 "process.levels": {
  "group": "process",
  "label": "수준·단계 스펙트럼 카드",
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
   "cols": "항목 수에 맞춤",
   "grow": "1.0",
   "emphasis": "none",
   "bg": "base"
  }
 },
 "process.branch": {
  "group": "process",
  "label": "분기 흐름(커밋·브랜치 같은 갈래 단계)",
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
   "connector": "line",
   "bg": "base"
  }
 },
 "process.growth": {
  "group": "process",
  "label": "성장 서사(이전 → 이후 패널)",
  "fields": {
   "title": "상태",
   "desc": "설명",
   "icon": "수치"
  },
  "status": "ready",
  "shortcode": "process.growth",
  "pptx_shortcode": "before-after",
  "variants": [],
  "defaults": {
   "bg": "base"
  }
 },
 "process.cycle-3": {
  "group": "process",
  "label": "삼각 순환",
  "fields": {
   "icon": "아이콘",
   "title": "단계",
   "desc": "설명"
  },
  "status": "ready",
  "shortcode": "process.cycle-3",
  "pptx_shortcode": "step-flow",
  "variants": [],
  "defaults": {
   "bg": "base"
  }
 },
 "process.zigzag": {
  "group": "process",
  "label": "지그재그 로드맵",
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
   "emphasis": "none",
   "bg": "base"
  }
 },
 "process.cards-arrow-4": {
  "group": "process",
  "label": "카드 4단계 + 화살표(원·하단 목록)",
  "fields": {
   "title": "단계 이름",
   "desc": "원 안 글(짧게)",
   "meta": "글머리(｜ 구분)"
  },
  "status": "ready",
  "shortcode": "process.cards-arrow-4",
  "pptx_shortcode": "step-flow",
  "variants": [],
  "defaults": {}
 },
 "process.input-circles-4": {
  "group": "process",
  "label": "입력 상자 → 원 4단계 → 하단 흐름",
  "fields": {
   "title": "단계 이름",
   "desc": "원 안 글(짧게)",
   "meta": "글머리(｜ 구분)"
  },
  "status": "ready",
  "shortcode": "process.input-circles-4",
  "pptx_shortcode": "step-flow",
  "variants": [],
  "defaults": {}
 },
 "process.band-columns-3": {
  "group": "process",
  "label": "머리띠 + 3열(원·전→후 비교)",
  "fields": {
   "title": "열 이름",
   "desc": "번호 원 글",
   "meta": "전 | 후 | 전 | 후 … (짝으로 읽어 전 → 후 줄)"
  },
  "status": "ready",
  "shortcode": "process.band-columns-3",
  "pptx_shortcode": "step-flow",
  "variants": [],
  "defaults": {}
 },
 "process.steps-checklist-3": {
  "group": "process",
  "label": "머리띠 + 3단계 + 체크 목록",
  "fields": {
   "title": "단계 이름",
   "desc": "번호 원 글",
   "meta": "체크 목록(｜ 구분)"
  },
  "status": "ready",
  "shortcode": "process.steps-checklist-3",
  "pptx_shortcode": "step-flow",
  "variants": [],
  "defaults": {}
 },
 "structure.hub": {
  "group": "structure",
  "label": "중심-주변(허브·스포크)",
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
  "defaults": {
   "bg": "base"
  }
 },
 "structure.pillars": {
  "group": "structure",
  "label": "기반 위 기둥",
  "fields": {
   "title": "첫 항목 = 기반, 나머지 = 기둥",
   "desc": "설명",
   "icon": "아이콘"
  },
  "status": "ready",
  "shortcode": "structure.pillars",
  "pptx_shortcode": "columns-grid",
  "variants": [],
  "defaults": {
   "bg": "base"
  }
 },
 "structure.rings": {
  "group": "structure",
  "label": "동심원 포함관계(바깥 → 안)",
  "fields": {
   "title": "범주",
   "color": "색",
   "icon": "마지막 항목 = 중심 아이콘"
  },
  "status": "ready",
  "shortcode": "concentric-rings",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {
   "bg": "base"
  }
 },
 "structure.venn": {
  "group": "structure",
  "label": "벤 다이어그램(두 원 + 교집합)",
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
  "defaults": {
   "bg": "base"
  }
 },
 "structure.groups-2x3": {
  "group": "structure",
  "label": "2그룹 × 원 3",
  "fields": {
   "title": "그룹 이름(알약)",
   "desc": "설명",
   "meta": "원(｜ 구분, 3~4개)"
  },
  "status": "ready",
  "shortcode": "structure.groups-2x3",
  "pptx_shortcode": "columns-grid",
  "variants": [],
  "defaults": {}
 },
 "data.stats": {
  "group": "data",
  "label": "통계 패널(큰 수치·이름·설명)",
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
   "cols": "항목 수에 맞춤",
   "emphasis": "none",
   "bg": "base"
  }
 },
 "data.summary-bar": {
  "group": "data",
  "label": "수치 요약 띠(한 줄)",
  "fields": {
   "icon": "수치",
   "title": "이름"
  },
  "status": "ready",
  "shortcode": "summary-bar",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {
   "bg": "base"
  }
 },
 "data.bars": {
  "group": "data",
  "label": "막대그래프(극단 대비)",
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
   "emphasis": "none",
   "bg": "base"
  }
 },
 "data.quadrant": {
  "group": "data",
  "label": "사분면 위치 차트",
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
  "defaults": {
   "bg": "base"
  }
 },
 "data.gauge": {
  "group": "data",
  "label": "반원 게이지(위치·비율)",
  "fields": {
   "title": "이름",
   "icon": "값(0~100)",
   "desc": "설명"
  },
  "status": "ready",
  "shortcode": "data.gauge",
  "pptx_shortcode": "stat-grid",
  "variants": [],
  "defaults": {
   "bg": "base"
  }
 },
 "sample.chart-pair": {
  "group": "sample",
  "label": "견본: 막대 차트 2개(원본 내용 포함)",
  "fields": {
   "title": "칸"
  },
  "status": "fallback",
  "shortcode": "stat-grid",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {}
 },
 "text.statement": {
  "group": "text",
  "label": "텍스트 전용(중앙 문장·요약·질문)",
  "fields": {
   "title": "중앙 문장",
   "desc": "보조 문장",
   "meta": "요약 줄(｜ 구분)"
  },
  "status": "ready",
  "shortcode": "text.statement",
  "pptx_shortcode": "summary-box",
  "variants": [],
  "defaults": {
   "bg": "base"
  }
 },
 "text.body": {
  "group": "text",
  "label": "일반 문단·글머리(숏코드 없이 쓴 본문)",
  "fields": {
   "desc": "문단 또는 글머리 한 줄"
  },
  "status": "ready",
  "shortcode": "text.body",
  "pptx_shortcode": "summary-box",
  "variants": [],
  "defaults": {
   "bg": "base"
  }
 },
 "text.quote": {
  "group": "text",
  "label": "인물 핵심 발언(얼굴·발언·하단 카드)",
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
  "defaults": {}
 },
 "text.takeaway": {
  "group": "text",
  "label": "핵심 메시지 띠",
  "fields": {
   "icon": "아이콘",
   "title": "머리말",
   "desc": "메시지"
  },
  "status": "ready",
  "shortcode": "takeaway-banner",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {
   "bg": "base"
  }
 },
 "text.callout": {
  "group": "text",
  "label": "알림 상자(팁·주의·위험·정보)",
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
   "variant": "info",
   "bg": "base"
  }
 },
 "text.summary": {
  "group": "text",
  "label": "요약 상자(제목·설명·칩)",
  "fields": {
   "title": "제목",
   "desc": "설명",
   "meta": "칩(｜ 구분)"
  },
  "status": "ready",
  "shortcode": "summary-box",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {
   "bg": "base"
  }
 },
 "text.section": {
  "group": "text",
  "label": "구역 머리 띠(파트 표시)",
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
  "defaults": {
   "bg": "base"
  }
 },
 "text.icon-statement": {
  "group": "text",
  "label": "단일 아이콘 강조",
  "fields": {
   "icon": "아이콘",
   "title": "문장",
   "desc": "보조"
  },
  "status": "ready",
  "shortcode": "text.icon-statement",
  "pptx_shortcode": "takeaway-banner",
  "variants": [],
  "defaults": {
   "bg": "base"
  }
 },
 "text.avatar": {
  "group": "text",
  "label": "인물 이니셜 아바타(보조)",
  "fields": {
   "icon": "이니셜",
   "title": "이름",
   "desc": "소속"
  },
  "status": "ready",
  "shortcode": "text.avatar",
  "pptx_shortcode": "summary-box",
  "variants": [],
  "defaults": {}
 },
 "code.editor": {
  "group": "code",
  "label": "코드 편집기 창",
  "fields": {
   "title": "파일 이름",
   "tag": "언어",
   "desc": "코드(여러 줄)"
  },
  "status": "ready",
  "shortcode": "editor-box",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {
   "bg": "base"
  }
 },
 "code.console": {
  "group": "code",
  "label": "실행 결과 콘솔",
  "fields": {
   "title": "제목",
   "tag": "꼬리표",
   "desc": "출력(여러 줄)"
  },
  "status": "ready",
  "shortcode": "console-box",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {
   "bg": "base"
  }
 },
 "code.command": {
  "group": "code",
  "label": "명령 한 줄",
  "fields": {
   "title": "설명",
   "tag": "셸",
   "desc": "명령"
  },
  "status": "ready",
  "shortcode": "cmd-box",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {
   "bg": "base"
  }
 },
 "nav.faq": {
  "group": "nav",
  "label": "질문·답변 목록",
  "fields": {
   "title": "질문",
   "desc": "답변"
  },
  "status": "ready",
  "shortcode": "faq-list",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {
   "bg": "base"
  }
 },
 "nav.tabs": {
  "group": "nav",
  "label": "탭(같은 주제의 갈래별 내용)",
  "fields": {
   "title": "탭 이름",
   "desc": "내용"
  },
  "status": "ready",
  "shortcode": "os-tabs",
  "pptx_shortcode": null,
  "variants": [],
  "defaults": {
   "bg": "base"
  }
 },
 "nav.chapters": {
  "group": "nav",
  "label": "장 목록(번호·제목·설명·종류)",
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
  "defaults": {
   "bg": "base"
  }
 },
 "media.cards-image": {
  "group": "media",
  "label": "정보 카드 N + 이미지",
  "fields": {
   "title": "카드 제목",
   "desc": "설명"
  },
  "status": "ready",
  "shortcode": "media.cards-image",
  "pptx_shortcode": "columns-grid",
  "variants": [],
  "defaults": {
   "side": "right",
   "bg": "base"
  }
 },
 "media.banner": {
  "group": "media",
  "label": "하단 이미지 배너",
  "fields": {
   "title": "글머리"
  },
  "status": "ready",
  "shortcode": "media.banner",
  "pptx_shortcode": "summary-box",
  "variants": [],
  "defaults": {
   "bg": "base"
  }
 },
 "media.full": {
  "group": "media",
  "label": "이미지 자리(전면)",
  "fields": {
   "desc": "이미지 프롬프트"
  },
  "status": "ready",
  "shortcode": "media.full",
  "pptx_shortcode": "summary-box",
  "variants": [],
  "defaults": {}
 },
 "sample.infographic-2": {
  "group": "sample",
  "label": "견본: 2단 인포그래픽(원본 내용 포함)",
  "fields": {
   "title": "칸"
  },
  "status": "fallback",
  "shortcode": "grid.box-2",
  "pptx_shortcode": "summary-box",
  "variants": [],
  "defaults": {}
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
  "body": "- icon: \"🚀\"\n  title: \"빠른 퍼포먼스\"\n  desc: \"최적화된 빌드와 빌트인 파서 탑재\"\n- icon: \"🎨\"\n  title: \"디자인 테마 선택\"\n  desc: \"다양한 테마 조합 가능\"",
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
  "body": "- icon: \"🌟\"\n  title: \"신속성\"\n  tag: \"Fast\"\n- icon: \"🔒\"\n  title: \"보안성\"\n  tag: \"Secure\""
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
  "body": "- title: \"Q. 숏코드가 정상적으로 렌더링되지 않아요.\"\n  desc: \"A. 숏코드 내부 인덴트(여백)나 문법이 V2 규격(::: 숏코드명)과 일치하는지 확인하십시오.\""
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
