/**
 * pptx-core/items.mjs — 숏코드 본문 → 항목 목록(Universal Schema 6대 키: icon·title·desc·tag·meta·color + note·featured)
 * MD → PPTX 공용 코어의 부분(fs/path 없음). CLI(md-to-pptx.mjs)와 브라우저(src/lib/pptx-browser.ts)가 같은 코어를 부른다.
 */

export function standardizeItem(item) {
  const rawName = item.name || item.title || "";
  const iconMatch = rawName.match(/^([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])\s*(.*)$/);

  const icon =     item.icon || (iconMatch ? iconMatch[1] : "") || "";
  const title =    item.title || (iconMatch ? iconMatch[2] : item.name) || item.col || "";
  const desc =     String(item.desc || item.description || item.tagline || item.body || "").replace(/\\n/g, "\n");
  const tag =      item.tag || item.badge || "";
  const color =    item.color || "";
  const featured = String(item.featured || "").trim().toLowerCase() === "true" ? "true" : "";

  // meta와 note를 보존
  const meta = item.meta || item.features || item.items || item.points || item.tool || "";
  const note = String(item.note || "").replace(/\\n/g, "\n");

  return {
    icon,
    title,
    desc,
    tag,
    meta,
    note,
    color,
    featured
  };
}

export function parseShortcodeItems(src) {
  const items = [];
  let current = null;
  let currentKey = null;
  let inLiteralBlock = false;

  for (const line of src.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (inLiteralBlock && line.startsWith("    ")) {
      const val = line.slice(4);
      const sep = currentKey === 'meta' ? ' | ' : '\n';
      const existing = current[currentKey];
      current[currentKey] = (!existing || existing === '|') ? val : existing + sep + val;
      continue;
    } else {
      inLiteralBlock = false;
    }

    const firstMatch = line.match(/^\s*-\s*([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (firstMatch) {
      currentKey = firstMatch[1];
      let val = cleanValue(firstMatch[2]);
      if (val === "|") {
        inLiteralBlock = true;
        current = { [currentKey]: "" };
      } else {
        current = { [currentKey]: val };
      }
      items.push(current);
      continue;
    }

    const nextMatch = line.match(/^\s+([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (nextMatch && current) {
      currentKey = nextMatch[1];
      let val = cleanValue(nextMatch[2]);
      if (val === "|") {
        inLiteralBlock = true;
        current[currentKey] = "";
      } else {
        current[currentKey] = val;
      }
      continue;
    }

    const listMatch = line.match(/^\s+-\s+(.+)$/);
    if (listMatch && current && currentKey) {
      const val = listMatch[1].trim();
      const existing = current[currentKey];
      const sep = currentKey === 'meta' ? ' | ' : '\n';
      current[currentKey] = (!existing || existing === '|') ? val : existing + sep + val;
      continue;
    }

    if (line.match(/^\s+\S/) && current && currentKey) {
      const val = line.trim();
      if (val === '|') {
        inLiteralBlock = true;
        continue;
      }
      const existing = current[currentKey];
      const sep = currentKey === 'meta' ? ' | ' : '\n';
      current[currentKey] = (!existing || existing === '|') ? val : existing + sep + val;
    }
  }

  return items.map(standardizeItem);
}

export function cleanValue(v) {
  const s = String(v ?? "").trim();
  if (s.length >= 2 && s[0] === '"' && s[s.length - 1] === '"') {
    return s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  }
  if (s.length >= 2 && s[0] === "'" && s[s.length - 1] === "'") {
    return s.slice(1, -1);
  }
  return s.replace(/^["']|["']$/g, "");
}
