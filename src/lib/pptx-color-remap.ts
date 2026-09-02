import type JSZip from 'jszip';

export interface DetectedColor {
  hex: string;
  count: number;
}

export interface ScanResult {
  slideCount: number;
  colors: DetectedColor[];
}

// PPTX 내부 XML에서 슬라이드 개수와 사용된 색상(빈도순)을 스캔한다.
export async function scanPptxColors(zip: JSZip): Promise<ScanResult> {
  const slideKeys = Object.keys(zip.files).filter(k => /^ppt\/slides\/slide\d+\.xml$/.test(k));

  const colorsMap: Record<string, number> = {};
  for (const k of Object.keys(zip.files)) {
    const f = zip.files[k];
    if (f.dir || !k.endsWith('.xml')) continue;
    const txt = await f.async('string');

    let m;
    const r1 = /srgbClr val="([A-Fa-f0-9]{6})"/gi;
    while ((m = r1.exec(txt)) !== null) {
      const h = m[1].toUpperCase();
      colorsMap[h] = (colorsMap[h] || 0) + 1;
    }
    const r2 = /lastClr="([A-Fa-f0-9]{6})"/gi;
    while ((m = r2.exec(txt)) !== null) {
      const h = m[1].toUpperCase();
      colorsMap[h] = (colorsMap[h] || 0) + 1;
    }
  }

  const colors = Object.entries(colorsMap)
    .map(([hex, count]) => ({ hex, count }))
    .sort((a, b) => b.count - a.count);

  return { slideCount: slideKeys.length, colors };
}

export interface RemapResult {
  blob: Blob;
  changedFiles: number;
  totalReps: number;
}

// mappings(From hex → To hex)에 따라 PPTX 내부 XML의 색상을 일괄 치환한다. 유효한 변경이 없으면 null.
export async function applyPptxColorRemap(zip: JSZip, mappings: Record<string, string>): Promise<RemapResult | null> {
  const activeRemaps = Object.entries(mappings).filter(([from, to]) => {
    const cleanTo = to.replace('#', '').toUpperCase();
    return cleanTo.length === 6 && /^[0-9A-Fa-f]{6}$/.test(cleanTo) && from !== cleanTo;
  });

  if (activeRemaps.length === 0) return null;

  let changedFiles = 0;
  let totalReps = 0;

  for (const k of Object.keys(zip.files)) {
    const f = zip.files[k];
    if (f.dir || !k.endsWith('.xml')) continue;
    let txt = await f.async('string');
    let fileChanged = false;

    for (const [from, to] of activeRemaps) {
      const cleanTo = to.replace('#', '').toUpperCase();
      const re = new RegExp(from, 'gi');
      const hits = (txt.match(re) || []).length;
      if (hits > 0) {
        txt = txt.replace(re, cleanTo);
        totalReps += hits;
        fileChanged = true;
      }
    }

    if (fileChanged) {
      zip.file(k, txt, { compression: 'DEFLATE' });
      changedFiles++;
    }
  }

  const blob = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  });

  return { blob, changedFiles, totalReps };
}
