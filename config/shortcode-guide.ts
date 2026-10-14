/**
 * shortcode-guide.ts — 숏코드 가이드 패널 + 삽입 툴바 공용 데이터 (단일 출처).
 * MarkdownCompiler 의 가이드 패널·삽입 메뉴·insertShortcode 가 모두 SHORTCODE_DOCS 를 참조한다.
 *
 * 이름은 하나로 운영한다(공용 배치 카탈로그 규칙) — 키·표시·스니펫 모두 기능 이름(`grid.cards`)만 쓴다.
 * 옛 숏코드 이름(icon-grid 등)은 읽기 호환 별칭일 뿐 여기 쓰지 않는다(scripts/library-names.mjs, npm run migrate:names).
 *
 * 데이터 출처
 *  - 분류(그룹)·라벨·칸·**스니펫(예시)** = 공용 카탈로그(config/library → scripts/library-map.mjs 의 LAYOUTS·LAYOUT_EXAMPLES) — pptgen 과 같은 예시
 *  - 사람이 쓴 짧은 제목·설명·필드 안내 = 아래 LAYOUT_DESC (카탈로그에 desc 가 생기면 그쪽으로 옮길 대상)
 *  - 목록에 오르는 배치 = cs_v2 구현 상태가 ready 인 것(근사 배치는 cs_v2 렌더러가 생기면 자동으로 오른다)
 */
// @ts-ignore — 순수 JS 생성 모듈
import { LAYOUTS, LAYOUT_GROUPS, LAYOUT_EXAMPLES } from "../scripts/library-map.mjs";

export interface ShortcodeDoc {
  /** 기능 이름(정식 이름 = 삽입·검색 키) */
  key: string;
  /** 표시 이름 — "<제목> (<기능 이름>)" */
  name: string;
  desc: string;
  fields: string;
  /** 삽입 스니펫 — 카탈로그 example 에서 만든다 */
  snippet: string;
  /** 기능 이름(= key, 기존 호출부 호환) */
  layout: string;
  /** 카탈로그 그룹 키 (grid·compare·process·structure·data·text·code·nav·media) */
  group: string;
  /** 그룹 표시 이름 (예: "비교·대조") */
  category: string;
}

/** 사람이 쓴 제목·설명·필드 안내 — 키는 기능 이름 */
const LAYOUT_DESC: Record<string, { title: string; desc: string; fields: string }> = {
  "compare.pair": { title: "⚖️ 2단 대조 비교", desc: "두 대상을 좌우로 2단 분할 배치하여 전후 관계나 상세 비교를 렌더링합니다.", fields: "title, desc, meta (구분선 | 목록)" },
  "compare.before-after": { title: "🔍 Before/After 전후 대조", desc: "AS-IS(구형)와 TO-BE(신형)를 ❌/✅ 레이블로 단순 명확하게 전후 대조합니다.", fields: "title, desc" },
  "grid.columns": { title: "🗂️ 다단 정보 카드 그리드", desc: "가로 다단 카드 격자. variant=plain 이면 상단 색 띠 없는 담백한 카드(비교 용도).", fields: "cols (속성: cols=2), variant=card|plain (속성), title, desc, note (팁박스), color (선택)" },
  "code.editor": { title: "🖥️ 에디터 시뮬레이션", desc: "코드 에디터 창(예: VS Code)의 외형을 흉내 낸 다크 에뮬레이터 블록입니다.", fields: "title (파일명), tag (언어), desc (코드 내용, 멀티라인 | 지원)" },
  "code.console": { title: "💻 콘솔 출력", desc: "시스템 명령어나 스크립트 실행 결과를 출력하는 콘솔화면 블록입니다.", fields: "title, tag, desc (멀티라인 | 지원)" },
  "code.command": { title: "⌨️ 터미널 명령어", desc: "실행해야 하는 명령어(CLI)를 안내하는 터미널 모형 박스입니다.", fields: "title, tag, desc" },
  "structure.hub": { title: "🕸️ 네트워크 다이어그램", desc: "여러 개념 간의 연계성 또는 네트워크 연결 관계를 시각화합니다.", fields: "title, meta, color (선택)" },
  "process.branch": { title: "🔧 Git Flow 흐름도", desc: "Git 브랜치나 버전 릴리즈 흐름을 노드형 다이어그램으로 가시화합니다.", fields: "title, tag, meta, color (선택)" },
  "process.track": { title: "➡️ 가로 이정표 흐름도", desc: "단계별 흐름을 가로로 표현. connector=arrow 면 화살표로 이은 단계, none 이면 연결 없음(화살표는 type: arrow 항목). tag:active 로 현재 단계 강조, meta 로 도구/코멘트.", fields: "connector=arrow|line|none (속성), icon, title, desc, meta (도구/코멘트), tag (active 시 강조), color (선택)" },
  "grid.cards": { title: "🧩 아이콘 카드 그리드", desc: "아이콘+제목+설명 카드 격자. align 으로 모양 변형: center(기본) / left(왼쪽 아이콘) / row(수평 배열).", fields: "cols (속성), bullet (속성), align=center|left|row (속성), icon, title, desc, color (선택)" },
  "grid.features": { title: "⭐ 핵심 기능 카드 그리드", desc: "태그 배지 및 아이콘이 포함된 다채로운 핵심 피처 카드 그리드입니다.", fields: "cols (속성), icon, title, desc, tag, color (선택)" },
  "grid.list": { title: "🧰 도구 목록", desc: "사용 도구나 스펙의 강점을 헤더(아이콘, 제목, 부제)와 기능 목록 형태로 렌더링합니다.", fields: "icon, title, desc, tag, meta (목록 구분선 |)" },
  "grid.tiers": { title: "💳 요금제 카드 그리드", desc: "추천 요금제(tag=Best)나 상품 가격/기능 구성품 스펙을 카드 형태로 비교합니다.", fields: "title, tag, meta (목록 구분선 |), featured (true 시 강조), color (선택), note (하단 설명)" },
  "grid.badges": { title: "🏷️ 배지 칩 그리드", desc: "여러 장점이나 키워드를 작은 배지 칩으로 콤팩트하게 나열합니다.", fields: "icon, title, tag, color (선택)" },
  "data.stats": { title: "📊 통계 지표 그리드", desc: "수치 데이터(icon)와 통계 지표 정보(title, desc)를 상단 바 보더와 함께 시각화합니다.", fields: "icon (수치), title, desc, color (선택)" },
  "text.callout": { title: "⚠️ 경고/알림 박스", desc: "팁·정보·주의·위험·성공 알림 상자. 종류는 첫 인수 또는 variant= (tip|info|warning|danger|success).", fields: "variant (첫 인수 가능), title, desc, color (선택)" },
  "text.summary": { title: "📝 하단 요약 박스", desc: "가이드 마지막 단에 배치하여 내용을 정리하고, 하단에 다량의 태그 칩을 덧붙입니다.", fields: "title, desc, meta (칩 구분선 |), color (선택)" },
  "text.takeaway": { title: "💡 핵심 테이크어웨이", desc: "강조하고 싶은 핵심 교훈이나 테이크어웨이 메시지를 한 줄 배너로 노출합니다.", fields: "icon, title, desc" },
  "text.section": { title: "🚩 파트/챕터 시작 배너", desc: "긴 문서나 슬라이드 중 단원/파트의 구분을 나누는 가로 대형 단막 배너입니다.", fields: "icon, title, desc, tag" },
  "data.summary-bar": { title: "📈 하단 수치 요약 바", desc: "수치 통계나 단위 성과들을 가로형 바 형태로 간결하게 나열합니다.", fields: "icon, title" },
  "process.steps": { title: "🔢 순서형 단계 리스트", desc: "1, 2, 3... 순번이 자동으로 매겨진 단계식 지침과 부연 설명을 노출합니다.", fields: "title, desc, color (선택)" },
  "nav.faq": { title: "❓ FAQ 아코디언", desc: "질문(title)과 그에 답하는 답변(desc) 형태의 아코디언 질문-답변 리스트입니다.", fields: "title, desc" },
  "nav.tabs": { title: "📁 OS/탭 전환", desc: "Windows / macOS 등 플랫폼별 조치 방법이나 다중 탭을 리스트로 안내합니다.", fields: "title, desc" },
  "nav.chapters": { title: "📚 챕터 목록", desc: "시리즈 부(Part) 하위에 속한 세부 챕터를 번호·제목·설명·구분 배지로 목록화합니다.", fields: "icon (챕터번호), title, desc, tag (개념/도구/사례/가이드/실습/주의/핵심)" },
  "process.levels": { title: "📶 레벨 스펙트럼", desc: "난이도·성숙도·역량 구간을 카드 격자로 비교. tag:highlight 로 강조 카드 지정.", fields: "title (레벨명), desc, color (선택), tag (highlight 시 강조)" },
  "structure.venn": { title: "⭕ 벤 다이어그램", desc: "두 영역이 겹칠 때 새로운 가치/의미가 발생함을 표현. 항목 3개 고정 순서(왼쪽 원 / 오른쪽 원 / 교집합 캡션).", fields: "[0]title,color (왼쪽 원) · [1]title,color (오른쪽 원) · [2]icon,desc (교집합, 선택)" },
  "structure.rings": { title: "🎯 동심원 포함관계", desc: "A⊃B⊃C 같은 계층적 포함관계 표현. 항목은 바깥(큰 범주)에서 안쪽(구체적 범주) 순서로 작성.", fields: "title (범주명), color, icon (마지막 항목에만 — 중심 아이콘)" },
  "data.quadrant": { title: "📍 사분면 차트", desc: "두 축(X/Y) 기준으로 여러 항목의 상대 위치를 비교. 축 라벨은 블록 인수로 지정.", fields: "블록 인수 xLabel=\"...\" yLabel=\"...\" · title, color, fx/fy (0~1 비율)" },
};

type Entry = { group: string; label: string; status: string; fields?: Record<string, string> };
type Example = { args?: string; body: string };
const L = LAYOUTS as Record<string, Entry>;
const EX = LAYOUT_EXAMPLES as Record<string, Example>;
const groupLabel = (g: string) => String((LAYOUT_GROUPS as Record<string, string>)[g] || g).split(" — ")[0];
const snippetOf = (name: string) => { const e = EX[name]; return e ? `::: ${name}${e.args ? " " + e.args : ""}\n${e.body}\n:::` : `::: ${name}\n- title: ""\n:::`; };

export const SHORTCODE_DOCS: ShortcodeDoc[] = Object.entries(L)
  .filter(([, e]) => e.status === "ready")
  .map(([name, e]) => {
    const d = LAYOUT_DESC[name];
    return {
      key: name,
      name: `${d ? d.title : e.label} (${name})`,
      desc: d ? d.desc : e.label,
      fields: d ? d.fields : Object.keys(e.fields || {}).join(", "),
      snippet: snippetOf(name),
      layout: name,
      group: e.group,
      category: groupLabel(e.group),
    };
  });

/** 가이드 패널 분류 버튼·삽입 메뉴 그룹 순서 = 카탈로그 그룹 순서 (실제로 숏코드가 있는 그룹만) */
export const SHORTCODE_CATEGORIES: string[] = Object.keys(LAYOUT_GROUPS as Record<string, string>)
  .filter((g) => SHORTCODE_DOCS.some((d) => d.group === g))
  .map(groupLabel);
