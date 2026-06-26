#!/usr/bin/env node
// ════════════════════════════════════════════════════════════════
//  verify-pptx-roundtrip.mjs  —  모듈1 변환 검증 하네스 (Phase B)
//
//  md-to-pptx 로 샘플 PPTX 생성 → JSZip 해체 → pptx-analyzer.js 의 각
//  변환 함수(apply*)를 실제 슬라이드 XML 에 적용 → ① well-formed(jsdom)
//  ② 변경 카운트 ③ 전체 적용 후 재패키징·재로드 가능 여부를 검증한다.
//
//  목적: 정규식 기반 XML 조작이 어떤 변환에서 구조를 훼손해
//        PowerPoint 복구 경고(손상 파일)를 유발하는지 사전 특정(G3).
//
//  실행: node scripts/verify-pptx-roundtrip.mjs [--md <path>] [--keep]
// ════════════════════════════════════════════════════════════════
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import JSZip from "jszip";
import { JSDOM } from "jsdom";
import {
  applyFontRunProps, applyShapeOps, applyShapeFillLine,
  applyShapePresets, applyLayoutToXml,
} from "./pptx-analyzer.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const { DOMParser } = new JSDOM().window;

const argv = process.argv.slice(2);
const mdArg = (() => { const i = argv.indexOf("--md"); return i >= 0 ? argv[i + 1] : "md_src/showcase/showcase.md"; })();
const keep = argv.includes("--keep");

const C = { reset: "\x1b[0m", red: "\x1b[31m", green: "\x1b[32m", yellow: "\x1b[33m", dim: "\x1b[2m" };
const ok = (s) => `${C.green}✔ ${s}${C.reset}`;
const bad = (s) => `${C.red}✘ ${s}${C.reset}`;
const warn = (s) => `${C.yellow}⚠ ${s}${C.reset}`;

function wellFormed(xml) {
  const doc = new DOMParser().parseFromString(xml, "text/xml");
  const err = doc.getElementsByTagName("parsererror");
  return err.length === 0 ? { ok: true } : { ok: false, msg: (err[0].textContent || "").split("\n")[0] };
}

// ── 0. 하네스 자체 sanity: jsdom 이 malformed XML 을 잡는지 ──
(() => {
  if (wellFormed("<a><b></a>").ok) {
    console.error(bad("하네스 오류: jsdom DOMParser 가 malformed XML 을 통과시킴 — 검증 무의미"));
    process.exit(2);
  }
})();

async function main() {
  // ── 1. 샘플 PPTX 생성 ──
  const outPptx = path.join(os.tmpdir(), `harness_${Date.now()}.pptx`);
  console.log(`${C.dim}샘플 생성: ${mdArg} → ${outPptx}${C.reset}`);
  const gen = spawnSync(process.execPath, ["scripts/md-to-pptx.mjs", mdArg, "--out", outPptx], { cwd: ROOT, encoding: "utf8" });
  if (gen.status !== 0 || !fs.existsSync(outPptx)) {
    console.error(bad("샘플 PPTX 생성 실패"), gen.stderr || gen.stdout);
    process.exit(2);
  }

  // ── 2. 해체 + 슬라이드 XML 수집 ──
  const buf = fs.readFileSync(outPptx);
  const zip = await JSZip.loadAsync(buf);
  const slideKeys = Object.keys(zip.files).filter((k) => /^ppt\/slides\/slide\d+\.xml$/.test(k)).sort();
  const slides = {};
  for (const k of slideKeys) slides[k] = await zip.file(k).async("string");
  console.log(`슬라이드 ${slideKeys.length}개 로드\n`);

  // 베이스라인: 원본 슬라이드가 전부 well-formed 인지
  let baseBad = 0;
  for (const k of slideKeys) if (!wellFormed(slides[k]).ok) { console.log(bad(`원본 ${k} 자체가 malformed`)); baseBad++; }
  if (!baseBad) console.log(ok("원본 슬라이드 전부 well-formed (기준선)"));

  // ── 3. 콘텐츠에서 현실적 변환 인자 추출 ──
  const allXml = Object.values(slides).join("");
  const typeface = (allXml.match(/typeface="([^"]+)"/) || [])[1] || "맑은 고딕";
  const srgb = (allXml.match(/srgbClr val="([A-Fa-f0-9]{6})"/) || [])[1] || "1A1A2E";
  console.log(`${C.dim}추출 인자: typeface="${typeface}", srgbClr=${srgb}${C.reset}\n`);

  // ── 4. 변환별 검증 케이스 ──
  const cases = [
    {
      name: "applyFontRunProps (폰트 크기·볼드)",
      fn: (xml) => applyFontRunProps(xml, [{ from: typeface, to: typeface, sizeScale: 1.2, boldMode: "on" }]),
      changed: (r) => r.sz + r.bold,
    },
    {
      name: "applyShapeOps (그림자/글로우/그라데이션)",
      fn: (xml) => applyShapeOps(xml, { removeShadow: true, removeGlow: true, flattenGradient: true, removeOutline: false }),
      changed: (r) => r.count,
    },
    {
      name: "applyShapeFillLine (채움·선)",
      fn: (xml) => applyShapeFillLine(xml, { fillColorOn: true, fillColor: "#FF0000", fillAlphaOn: false, lineColorOn: true, lineColor: "#00FF00", lineWidthOn: true, lineWidth: 2, lineAlphaOn: false }),
      changed: (r) => r.fillN + r.lineN,
    },
    {
      name: "applyLayoutToXml (placeholder 좌표)",
      fn: (xml) => applyLayoutToXml(xml, [{ id: "title", active: true, x: 1, y: 1, w: 8, h: 1 }, { id: "body", active: true, x: 1, y: 2, w: 8, h: 5 }]),
      changed: (r) => r.count,
    },
    {
      name: "전역 색상 치환 (srgbClr/lastClr 정규식)",
      fn: (xml) => {
        const re = new RegExp('((?:srgbClr val|lastClr)=")' + srgb + '(")', "gi");
        const n = (xml.match(re) || []).length;
        return { txt: xml.replace(re, "$1FF8800$2"), n };
      },
      changed: (r) => r.n,
    },
  ];

  let anyMalformed = false;
  for (const c of cases) {
    let applied = 0, malformed = [];
    for (const k of slideKeys) {
      const r = c.fn(slides[k]);
      const cnt = c.changed(r);
      applied += cnt;
      if (cnt > 0) {
        const wf = wellFormed(r.txt);
        if (!wf.ok) { malformed.push(`${k}: ${wf.msg}`); anyMalformed = true; }
      }
    }
    const status = malformed.length ? bad(`well-formed 깨짐 ${malformed.length}건`) : (applied ? ok("well-formed 유지") : warn("변경 0 (샘플에 해당 요소 없음)"));
    console.log(`${c.name}\n  적용 ${applied}건 · ${status}`);
    for (const m of malformed.slice(0, 3)) console.log(`    ${C.red}↳ ${m}${C.reset}`);
  }

  // ── 5. 전체 변환 후 재패키징·재로드 (실제 변환 경로 모사) ──
  console.log(`\n${C.dim}── 전체 변환 후 재패키징·재로드 ──${C.reset}`);
  let rezipOk = true;
  try {
    for (const k of slideKeys) {
      let txt = slides[k];
      txt = applyShapeOps(txt, { removeShadow: true, removeGlow: true, flattenGradient: true }).txt;
      txt = applyShapeFillLine(txt, { fillColorOn: true, fillColor: "#3366CC", lineColorOn: true, lineColor: "#112233", lineWidthOn: true, lineWidth: 1.5 }).txt;
      txt = applyFontRunProps(txt, [{ from: typeface, to: typeface, sizeScale: 1.1, boldMode: "on" }]).txt;
      txt = applyLayoutToXml(txt, [{ id: "title", active: true, x: 1, y: 1, w: 8, h: 1 }]).txt;
      zip.file(k, txt, { compression: "DEFLATE" });
    }
    const outBlob = await zip.generateAsync({ type: "nodebuffer" });
    const reload = await JSZip.loadAsync(outBlob);
    const reslides = Object.keys(reload.files).filter((k) => /slide\d+\.xml$/.test(k));
    let reBad = 0;
    for (const k of reslides) if (!wellFormed(await reload.file(k).async("string")).ok) reBad++;
    if (reBad) { console.log(bad(`재로드 후 malformed ${reBad}건`)); rezipOk = false; }
    else console.log(ok(`재패키징·재로드 정상 (슬라이드 ${reslides.length}개 well-formed)`));
  } catch (e) {
    console.log(bad(`재패키징 실패: ${e.message}`));
    rezipOk = false;
  }

  if (!keep) fs.rmSync(outPptx, { force: true });

  console.log("");
  if (anyMalformed || !rezipOk) {
    console.log(bad("결과: 구조 훼손 케이스 발견 → G3 수정 대상 (위 ↳ 항목)"));
    process.exit(1);
  }
  console.log(ok("결과: 모든 변환이 well-formed 유지 + 재패키징 정상"));
  console.log(`${C.dim}참고: jsdom 은 구문(well-formed)만 검사. OOXML 스키마 위반(요소 순서·필수 속성)은 별도 — PowerPoint 실제 열기 확인 권장.${C.reset}`);
}

main().catch((e) => { console.error(bad("하네스 예외:"), e); process.exit(2); });
