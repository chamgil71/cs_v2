import { describe, it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
// @ts-ignore — 순수 JS 변환 lib
import {
  applyFontRunProps, applyShapeOps, applyShapeFillLine,
  applyShapePresets, applyLayoutToXml,
} from '../../scripts/pptx-analyzer.js';

/**
 * 모듈1 변환 함수 엣지 케이스 검증 (G2 테스트 공백 + G3 손상 특정).
 *
 * md-to-pptx 산출물엔 도형 효과·placeholder·그룹도형이 없어 검증 하네스로는
 * 미검증인 경로를, 수제 OOXML 픽스처로 직접 검증한다.
 *  - well-formed(구문) : jsdom DOMParser
 *  - 스키마 순서       : spPr 자식 요소 순서가 OOXML 시퀀스를 위반하지 않는지
 */

const { DOMParser } = new JSDOM().window as any;

const NS =
  'xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" ' +
  'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"';

function root(inner: string): string {
  return `<p:sld ${NS}><p:cSld><p:spTree>${inner}</p:spTree></p:cSld></p:sld>`;
}
function wellFormed(xml: string): { ok: boolean; msg?: string } {
  const doc = new DOMParser().parseFromString(xml, 'text/xml');
  const err = doc.getElementsByTagName('parsererror');
  return err.length ? { ok: false, msg: (err[0].textContent || '').split('\n')[0] } : { ok: true };
}
// spPr 자식의 OOXML 권장 순서 인덱스 (작을수록 앞). 핵심 요소만.
const SPPR_ORDER: Record<string, number> = {
  'a:xfrm': 0, 'a:custGeom': 1, 'a:prstGeom': 1,
  'a:noFill': 2, 'a:solidFill': 2, 'a:gradFill': 2, 'a:blipFill': 2, 'a:pattFill': 2, 'a:grpFill': 2,
  'a:ln': 3, 'a:effectLst': 4, 'a:effectDag': 4, 'a:scene3d': 5, 'a:sp3d': 6,
};
// spPr 의 **직계** 자식 순서가 단조 증가하는지 DOM 으로 검사 (중첩 요소 무시).
// 위반 = PowerPoint 복구 유발. (정규식이 아닌 DOM 으로 깊이 정확히 처리)
function spPrOrderOk(xml: string): { ok: boolean; seq?: string[] } {
  const doc = new DOMParser().parseFromString(xml, 'text/xml');
  const spPrs = Array.from(doc.getElementsByTagName('p:spPr')) as any[];
  for (const spPr of spPrs) {
    let last = -1;
    const seq: string[] = [];
    for (const child of Array.from(spPr.childNodes) as any[]) {
      if (child.nodeType !== 1) continue; // 엘리먼트만
      const tag: string = child.nodeName;
      if (!(tag in SPPR_ORDER)) continue;
      seq.push(tag);
      const idx = SPPR_ORDER[tag];
      if (idx < last) return { ok: false, seq };
      last = idx;
    }
  }
  return { ok: true };
}

describe('applyShapeOps — 효과 제거', () => {
  it('outerShdw/glow/gradFill 제거 후 well-formed', () => {
    const xml = root(
      '<p:sp><p:spPr><a:solidFill><a:srgbClr val="112233"/></a:solidFill>' +
      '<a:effectLst><a:outerShdw blurRad="40000"><a:srgbClr val="000000"/></a:outerShdw>' +
      '<a:glow rad="50000"><a:srgbClr val="FFFF00"/></a:glow></a:effectLst></p:spPr></p:sp>'
    );
    const r = applyShapeOps(xml, { removeShadow: true, removeGlow: true, flattenGradient: true });
    expect(r.count).toBeGreaterThan(0);
    expect(wellFormed(r.txt).ok, wellFormed(r.txt).msg).toBe(true);
    expect(r.txt).not.toContain('outerShdw');
    expect(r.txt).not.toContain('a:glow');
  });

  it('removeOutline → <a:ln> 이 noFill 로 치환되고 well-formed (G4 신규구현)', () => {
    const xml = root(
      '<p:sp><p:spPr><a:solidFill><a:srgbClr val="112233"/></a:solidFill>' +
      '<a:ln w="12700"><a:solidFill><a:srgbClr val="445566"/></a:solidFill></a:ln></p:spPr></p:sp>'
    );
    const r = applyShapeOps(xml, { removeOutline: true });
    expect(r.count).toBeGreaterThan(0);
    expect(wellFormed(r.txt).ok, wellFormed(r.txt).msg).toBe(true);
    expect(r.txt).toContain('<a:ln w="12700"><a:noFill/></a:ln>');
    expect(spPrOrderOk(r.txt).ok).toBe(true);
    // 멱등성: 두 번 적용해도 동일
    const r2 = applyShapeOps(r.txt, { removeOutline: true });
    expect(r2.count).toBe(0);
  });

  it('removeOutline 이 a:lnRef / 표 테두리(a:lnL)는 건드리지 않음', () => {
    const xml = root(
      '<p:sp><p:style><a:lnRef idx="2"><a:schemeClr val="accent1"/></a:lnRef></p:style>' +
      '<p:spPr><a:ln w="6350"><a:solidFill><a:srgbClr val="000000"/></a:solidFill></a:ln></p:spPr></p:sp>'
    );
    const r = applyShapeOps(xml, { removeOutline: true });
    expect(r.txt).toContain('<a:lnRef idx="2">'); // 보존
    expect(wellFormed(r.txt).ok).toBe(true);
  });

  it('gradFill → solidFill 평탄화 후 spPr 순서 유지', () => {
    const xml = root(
      '<p:sp><p:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="100" cy="100"/></a:xfrm>' +
      '<a:gradFill><a:gsLst><a:gs pos="0"><a:srgbClr val="AABBCC"/></a:gs></a:gsLst></a:gradFill>' +
      '<a:ln w="12700"><a:solidFill><a:srgbClr val="445566"/></a:solidFill></a:ln></p:spPr></p:sp>'
    );
    const r = applyShapeOps(xml, { flattenGradient: true });
    expect(wellFormed(r.txt).ok).toBe(true);
    const ord = spPrOrderOk(r.txt);
    expect(ord.ok, `spPr 순서 위반: ${ord.seq?.join(' → ')}`).toBe(true);
  });
});

describe('applyShapeFillLine — 채움·선 (스키마 순서 핵심)', () => {
  it('fill 색 변경 + line 추가 시 fill이 ln보다 앞 (순서 유지)', () => {
    const xml = root(
      '<p:sp><p:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="100" cy="100"/></a:xfrm>' +
      '<a:prstGeom prst="rect"/><a:solidFill><a:srgbClr val="112233"/></a:solidFill>' +
      '<a:ln w="6350"><a:solidFill><a:srgbClr val="445566"/></a:solidFill></a:ln></p:spPr></p:sp>'
    );
    const r = applyShapeFillLine(xml, { fillColorOn: true, fillColor: '#FF0000', lineColorOn: true, lineColor: '#00FF00', lineWidthOn: true, lineWidth: 2 });
    expect(r.fillN + r.lineN).toBeGreaterThan(0);
    expect(wellFormed(r.txt).ok, wellFormed(r.txt).msg).toBe(true);
    const ord = spPrOrderOk(r.txt);
    expect(ord.ok, `spPr 순서 위반: ${ord.seq?.join(' → ')}`).toBe(true);
  });

  it('ln 이 noFill 인 도형에 색 추가해도 순서 유지', () => {
    const xml = root(
      '<p:sp><p:spPr><a:solidFill><a:srgbClr val="112233"/></a:solidFill>' +
      '<a:ln w="6350"><a:noFill/></a:ln></p:spPr></p:sp>'
    );
    const r = applyShapeFillLine(xml, { lineColorOn: true, lineColor: '#00FF00' });
    expect(wellFormed(r.txt).ok).toBe(true);
    expect(spPrOrderOk(r.txt).ok).toBe(true);
  });
});

describe('applyLayoutToXml — placeholder 좌표 (md-to-pptx 미포함 경로)', () => {
  it('title placeholder 좌표가 규칙대로 변경되고 well-formed', () => {
    const xml = root(
      '<p:sp><p:nvSpPr><p:cNvPr id="2" name="Title"/><p:cNvSpPr/><p:nvPr><p:ph type="title"/></p:nvPr></p:nvSpPr>' +
      '<p:spPr><a:xfrm><a:off x="838200" y="365125"/><a:ext cx="10515600" cy="1325563"/></a:xfrm><a:prstGeom prst="rect"/></p:spPr></p:sp>'
    );
    // 레이아웃 좌표 단위는 point (×12700 EMU/pt) — 슬라이드 720pt 폭 기준
    const r = applyLayoutToXml(xml, [{ id: 'title', active: true, x: 36, y: 21, w: 648, h: 90 }]);
    expect(r.count).toBeGreaterThan(0);
    expect(wellFormed(r.txt).ok, wellFormed(r.txt).msg).toBe(true);
    expect(r.txt).toContain('x="457200"'); // 36pt × 12700
    expect(r.txt).toContain('cx="8229600"'); // 648pt × 12700
  });
});

describe('applyFontRunProps — 폰트 크기·볼드', () => {
  it('지정 typeface 의 sz 배율·b 적용, well-formed', () => {
    const xml = root(
      '<p:sp><p:txBody><a:p><a:r><a:rPr lang="ko" sz="1800"><a:latin typeface="Pretendard"/></a:rPr>' +
      '<a:t>제목</a:t></a:r></a:p></p:txBody></p:sp>'
    );
    const r = applyFontRunProps(xml, [{ from: 'Pretendard', to: 'Pretendard', sizeScale: 1.5, boldMode: 'on' }]);
    expect(r.sz).toBeGreaterThan(0);
    expect(wellFormed(r.txt).ok).toBe(true);
    expect(r.txt).toContain('sz="2700"'); // 1800 * 1.5
    expect(r.txt).toContain('b="1"');
  });
});

describe('★ 그룹 도형 / 중첩 sp 경계 (정규식 취약성 의심)', () => {
  it('grpSp 내부 중첩 sp 에 preset 적용 시 구조 훼손 없음', () => {
    const inner =
      '<p:grpSp><p:nvGrpSpPr><p:cNvPr id="9" name="G"/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/>' +
      '<p:sp><p:nvSpPr><p:cNvPr id="10" name="Inner"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr>' +
      '<p:spPr><a:solidFill><a:srgbClr val="AABBCC"/></a:solidFill></p:spPr></p:sp></p:grpSp>';
    const xml = root(inner);
    const presets = [{ id: 'p1', lnXml: '<a:ln w="12700"><a:solidFill><a:srgbClr val="FF0000"/></a:solidFill></a:ln>', effectXml: '' }];
    const r = applyShapePresets(xml, { '10': 'p1' }, presets);
    expect(wellFormed(r.txt).ok, wellFormed(r.txt).msg).toBe(true);
  });

  it('grpSp 내부 sp 에 layout 규칙 적용 시 외부 grpSp 경계 보존', () => {
    const inner =
      '<p:grpSp><p:grpSpPr/>' +
      '<p:sp><p:nvSpPr><p:cNvPr id="11"/><p:cNvSpPr/><p:nvPr><p:ph type="body" idx="1"/></p:nvPr></p:nvSpPr>' +
      '<p:spPr><a:xfrm><a:off x="100" y="100"/><a:ext cx="200" cy="200"/></a:xfrm></p:spPr></p:sp></p:grpSp>';
    const xml = root(inner);
    const r = applyLayoutToXml(xml, [{ id: 'chapter', active: true, x: 1, y: 1, w: 5, h: 5 }]);
    expect(wellFormed(r.txt).ok, wellFormed(r.txt).msg).toBe(true);
    // grpSp 닫힘 태그가 보존되어야 함
    expect((r.txt.match(/<\/p:grpSp>/g) || []).length).toBe(1);
  });
});
