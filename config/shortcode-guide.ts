/**
 * shortcode-guide.ts — 숏코드 가이드 패널 + 삽입 툴바 공용 데이터 (단일 출처).
 * MarkdownCompiler 의 가이드 패널·삽입 메뉴·insertShortcode 가 모두 SHORTCODE_DOCS 를 참조한다.
 *
 * 이름은 하나로 운영한다(공용 본문 레이아웃 카탈로그 규칙) — 키·표시·스니펫 모두 기능 이름(`grid.cards`)만 쓴다.
 * 옛 숏코드 이름(icon-grid 등)은 읽기 호환 별칭일 뿐 여기 쓰지 않는다(scripts/library-names.mjs, npm run migrate:names).
 *
 * 데이터 출처
 *  - 분류(그룹)·라벨·칸·**스니펫(예시)** = 공용 카탈로그(library → scripts/library-map.mjs 의 LAYOUTS·LAYOUT_EXAMPLES) — pptgen 과 같은 예시
 *  - 메뉴 기호·설명 = 카탈로그 emoji·desc, 칸 안내 = 카탈로그 fields(칸 뜻) + args(cs_v2 가 읽는 본문 레이아웃 인수) — 코드에 설명 문구를 두지 않는다(2026-10-14, 인계서 E)
 *  - 목록에 오르는 본문 레이아웃 = cs_v2 구현 상태가 ready 인 것(근사 본문 레이아웃은 cs_v2 렌더러가 생기면 자동으로 오른다)
 */
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

type Arg = { values: string; default: string; cs_v2: boolean };
type Entry = { group: string; label: string; emoji: string; desc: string; status: string; fields?: Record<string, string>; args?: Record<string, Arg> };
type Example = { args?: string; body: string };
const L = LAYOUTS as Record<string, Entry>;
const EX = LAYOUT_EXAMPLES as Record<string, Example>;
const groupLabel = (g: string) => String((LAYOUT_GROUPS as Record<string, string>)[g] || g).split(" — ")[0];
/** 칸 안내 — "title 단계 · desc 설명 · 인수 grow=1.0~1.6(1.35)" (공통 인수 bg·title-size·desc-size 는 빼고) */
const COMMON_ARGS = new Set(["bg", "title-size", "desc-size"]);
const fieldsOf = (e: Entry) => [
  ...Object.entries(e.fields || {}).map(([k, v]) => `${k} ${v}`),
  ...Object.entries(e.args || {}).filter(([k, a]) => a.cs_v2 && !COMMON_ARGS.has(k)).map(([k, a]) => `인수 ${k}=${a.values}${a.default ? `(${a.default})` : ""}`),
].join(" · ");
const snippetOf = (name: string) => { const e = EX[name]; return e ? `::: ${name}${e.args ? " " + e.args : ""}\n${e.body}\n:::` : `::: ${name}\n- title: ""\n:::`; };

export const SHORTCODE_DOCS: ShortcodeDoc[] = Object.entries(L)
  .filter(([, e]) => e.status === "ready")
  .map(([name, e]) => {
    return {
      key: name,
      name: `${e.emoji ? e.emoji + " " : ""}${e.label} (${name})`,
      desc: e.desc || e.label,
      fields: fieldsOf(e),
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
