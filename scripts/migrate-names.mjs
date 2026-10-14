#!/usr/bin/env node
/**
 * migrate-names.mjs — md 의 옛 배치 이름을 기능 이름(+ 그 옛 이름이 뜻하던 인수)으로 바꾼다.
 *
 * 이름은 하나로 운영한다(공용 카탈로그 규칙): `::: compare-grid cols=2` → `::: grid.columns cols=2 variant=plain`.
 * 대응표는 코드에 두지 않고 카탈로그(scripts/library-map.mjs: LAYOUT_ALIASES · ALIAS_ARGS)에서 읽는다.
 * 출력은 바뀌지 않는다 — 렌더러는 옛 이름을 같은 방식으로 정규화하기 때문(바꾼 뒤 빌드 결과 동일을 확인할 것).
 *
 *   node scripts/migrate-names.mjs [경로|glob …] [--check]
 *   npm run migrate:names -- "md_src/**\/*.md"          (경로를 안 주면 md_src 전체)
 *   --check : 바꿀 곳만 보여 주고 파일은 그대로(남은 옛 이름이 있으면 종료코드 1)
 *
 * 코드 펜스 안의 `::: 옛이름` 줄과 이스케이프한 `\::: 옛이름` 줄(문법 설명 예시)도 바꾼다 — 문서도 이름 하나로.
 */
import { readFileSync, writeFileSync, statSync } from "node:fs";
import { glob } from "node:fs/promises";
import { resolve } from "node:path";
import { LAYOUTS, LAYOUT_ALIASES, ALIAS_ARGS, argKeys } from "./library-names.mjs";

const argv = process.argv.slice(2);
const CHECK = argv.includes("--check");
const targets = argv.filter((a) => !a.startsWith("--"));
const patterns = targets.length ? targets : ["md_src/**/*.md"];

const OPEN = /^(\s*\\?:::\s*)([A-Za-z0-9_.-]+)([ \t]+[^\r\n]*?)?([ \t]*)$/;

/** 한 줄: 옛 이름이면 { line, from, to } */
function migrateLine(line) {
  const m = line.match(OPEN);
  if (!m) return null;
  const name = m[2];
  if (LAYOUTS[name] || !LAYOUT_ALIASES[name]) return null;          // 기능 이름이거나 모르는 이름(slide-config 등)
  const layout = LAYOUT_ALIASES[name];
  const args = (m[3] || "").trim();
  const have = argKeys(args);
  const extra = Object.entries(ALIAS_ARGS[name] || {}).filter(([k]) => !(k in have)).map(([k, v]) => `${k}=${v}`);
  const newArgs = [args, ...extra].filter(Boolean).join(" ");
  return { line: `${m[1]}${layout}${newArgs ? " " + newArgs : ""}`, from: name, to: `${layout}${extra.length ? " " + extra.join(" ") : ""}` };
}

async function files() {
  const out = new Set();
  for (const p of patterns) {
    try { if (statSync(p).isFile()) { out.add(resolve(p)); continue; } } catch { /* glob 으로 */ }
    for await (const f of glob(p)) out.add(resolve(f));
  }
  return [...out].filter((f) => f.endsWith(".md")).sort();
}

let changed = 0, total = 0;
const tally = new Map();
for (const f of await files()) {
  const src = readFileSync(f, "utf8");
  let n = 0;
  const out = src.split("\n").map((line) => {
    const r = migrateLine(line);
    if (!r) return line;
    n++; tally.set(`${r.from} → ${r.to}`, (tally.get(`${r.from} → ${r.to}`) || 0) + 1);
    return r.line;
  }).join("\n");
  if (!n) continue;
  changed++; total += n;
  console.log(`${CHECK ? "·" : "✓"} ${f}  (${n}곳)`);
  if (!CHECK) writeFileSync(f, out);
}
for (const [k, v] of [...tally].sort((a, b) => b[1] - a[1])) console.log(`   ${String(v).padStart(4)}  ${k}`);
console.log(`${CHECK ? "옛 이름 남음" : "바꿈"}: 파일 ${changed}개 · ${total}곳`);
if (CHECK && total) process.exit(1);
