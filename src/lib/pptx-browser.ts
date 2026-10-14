/**
 * pptx-browser.ts — 브라우저 MD → PPTX (얇은 래퍼: config 를 ?raw 로 받고 + 코어 호출 + 다운로드)
 * 변환 자체는 공용 코어 scripts/pptx-core/(CLI scripts/md-to-pptx.mjs 와 같은 코드) — 브라우저 PPTX == CLI PPTX.
 * 예전에는 md-to-pptx.mjs 를 복사한 포트였고, 한쪽만 고쳐지며 갈라졌다(2026-10-14 코어로 합침 — docs/scripts_guide.md 5-1c).
 */

import './buffer-polyfill'; // 브라우저에서 gray-matter 가 쓰는 Buffer 전역 보강 (코어의 gray-matter import 보다 위)
import STYLES_RAW from '../../config/styles.json?raw';
import DESIGN_RAW from '../../config/pptdesign.config.json?raw';
import FONT_ALIASES_RAW from '../../config/font-aliases.json?raw';
import { buildPptx, parseJsonc } from '../../scripts/pptx-core/index.mjs';

const STYLES = parseJsonc(STYLES_RAW);
const FONT_ALIASES = parseJsonc(FONT_ALIASES_RAW);
const DESIGN = parseJsonc(DESIGN_RAW);

/** md 문자열 → PPTX 를 만들어 브라우저 다운로드(pptxgenjs writeFile 이 다운로드를 띄운다) */
export async function convertMdToPptxBrowser(
  mdContent: string,
  fileName: string,
  opts: { styleOverride?: string; noCover?: boolean } = {}
): Promise<void> {
  const { prs } = buildPptx(mdContent, {
    styles: STYLES, design: DESIGN, fontAliases: FONT_ALIASES,
    styleOverride: opts.styleOverride || null, noCover: !!opts.noCover,
  });
  await prs.writeFile({ fileName });
}
