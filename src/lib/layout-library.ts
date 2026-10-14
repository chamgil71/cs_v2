/**
 * layout-library.ts — 웹 "배치 라이브러리" 화면(모듈 1)의 데이터 도구.
 *
 * 화면이 보여 주는 모든 값은 공용 배치 카탈로그(config/library → scripts/library-map.mjs 생성본)에서 온다:
 * 배치 이름·그룹·칸·인수·예시·구현 상태(cs_v2/pptgen)·서식 세트. 이 파일은 그것을 화면용으로 고르고 미리보기 md 를 만들 뿐이다.
 * 같은 예시를 pptgen `node lib/run.js layout-views`(views/layouts.pptx)도 쓴다 — 웹과 pptx 미리보기가 같은 출처.
 */
import { LAYOUTS, LAYOUT_GROUPS, LAYOUT_EXAMPLES, SHAPE_SETS, LAYOUT_FALLBACK } from '../../scripts/library-map.mjs';

export type LayoutArg = { values: string; default: string; cs_v2: boolean; pptgen: boolean; note: string };
export type LayoutEntry = {
  name: string;
  group: string;
  label: string;
  fields: Record<string, string>;
  status: string;
  shortcode: string | null;
  pptx_shortcode: string | null;
  args: Record<string, LayoutArg>;
  pptgen: { status: string; pattern: string | null; theme: string | null };
  aliases: string[];
  example: { args?: string; body: string; more?: string[] } | null;
};

const L = LAYOUTS as Record<string, Omit<LayoutEntry, 'name' | 'example'>>;
const EX = LAYOUT_EXAMPLES as Record<string, LayoutEntry['example']>;
const G = LAYOUT_GROUPS as Record<string, string>;

/** 카탈로그 순서 그대로의 배치 목록 */
export const LAYOUT_ENTRIES: LayoutEntry[] = Object.entries(L).map(([name, e]) => ({ ...e, name, example: EX[name] || null }));

/** 그룹 키 → 짧은 이름(카탈로그 그룹 설명의 " — " 앞) */
export const groupLabel = (g: string) => String(G[g] || g).split(' — ')[0];
export const GROUP_KEYS: string[] = Object.keys(G).filter((g) => LAYOUT_ENTRIES.some((e) => e.group === g));

/** 서식 세트 이름·설명(카탈로그 shape-sets.json) */
export const SHAPE_SET_NAMES: string[] = Object.keys(SHAPE_SETS.sets);
export const shapeSetLabel = (s: string) => String((SHAPE_SETS.sets[s] || {}).label || s);
export const DEFAULT_SHAPE_SET: string = SHAPE_SETS.default;

/** 사람이 읽는 cs_v2 구현 상태 — HTML·PPTX 각각 */
export function implSummary(e: LayoutEntry): { html: string; pptx: string; direct: boolean } {
  if (e.status === 'ready' && e.shortcode === e.name) return { html: '모양 그대로(기능 이름 구현)', pptx: `근사 — ${e.pptx_shortcode}`, direct: true };
  if (e.status === 'ready') return { html: '모양 그대로', pptx: '모양 그대로', direct: true };
  const fb = e.shortcode || LAYOUT_FALLBACK.cs_v2;   // markdown/none → 카탈로그 fallback
  return { html: `근사 — ${fb}`, pptx: `근사 — ${e.pptx_shortcode || fb}`, direct: false };
}

/** pptgen 구현 요약 */
export function pptgenSummary(e: LayoutEntry): string {
  if (e.pptgen.status !== 'ready') return '없음';
  return e.pptgen.pattern ? `패턴 ${e.pptgen.pattern}${e.pptgen.theme ? ` · ${e.pptgen.theme} 테마 전용` : ''}` : '내장 렌더러';
}

/** 예시 변형 인수 목록(기본 + more) */
export const exampleVariants = (e: LayoutEntry): string[] => (e.example ? [...new Set([e.example.args || '', ...(e.example.more || [])])] : ['']);   // 같은 인수 중복 제거

/** 블록 스니펫(md 에 그대로 붙이는 모양) */
export function snippetOf(e: LayoutEntry, args = e.example?.args || ''): string {
  const body = e.example?.body || '- title: ""';
  return `::: ${e.name}${args ? ' ' + args : ''}\n${body}\n:::`;
}

/** 미리보기용 md — 테마(style)·서식 세트(shape)를 머리말로, 본문은 스니펫 하나 */
export function previewMd(e: LayoutEntry, args: string, style: string, shape: string): string {
  const q = (v: string) => JSON.stringify(v);
  return ['---', `title: ${q(e.name)}`, `style: ${q(style)}`, `shape: ${q(shape)}`, '---', '', `## ${e.label}`, '', snippetOf(e, args), ''].join('\n');
}

/** 검색: 기능 이름·설명·옛 이름(별칭)·그룹 이름 */
export function matches(e: LayoutEntry, q: string): boolean {
  const s = q.trim().toLowerCase();
  if (!s) return true;
  return [e.name, e.label, groupLabel(e.group), ...e.aliases].some((t) => String(t).toLowerCase().includes(s));
}
