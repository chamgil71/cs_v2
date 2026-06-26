import JSZip from 'jszip';

// Helper: check hex validity
export const vld = (h) => /^[0-9A-Fa-f]{6}$/.test(h || '');

// Helper: escape HTML entities
export const eh = (s) => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Helper: convert EMU to Point
export const e2p = (v) => v / 12700;

export const KNOWN = {
  'C1001B': '002060', 'FF0000': '2789F5', 'C00000': '002060', 'DC2626': '1575E9',
  'E60012': '2789F5', 'B91C1C': '1575E9', '990000': '002060',
  '5B21B6': '2789F5', 'A02B93': '1E4785', '7030A0': '1E4785',
  '12CD80': '0DB364', '04CD80': '02B0C2', '02A566': '0DB364', '00B050': '0DB364',
  '065F46': '073167', '196B24': '073167', '4EA72E': '0DB364', '70AD47': '0DB364',
  'E97132': '5B9BD5', 'ED7D31': '5B9BD5', 'FFC000': '23ABDE', '0F9ED5': '23ABDE',
  '156082': '1E4785', '467886': '4F6D90', '96607D': '4F6D90',
  '404040': '4F6D90', '595959': '4F6D90', '737373': '4F6D90',
  '374151': '1E4785', '3F4F5F': '1E4785',
  '6B7280': '4F6D90', '64748B': '4F6D90',
  '1A1A2E': '002060', '0E2841': '002060', '44546A': '4F6D90', '4472C4': '2789F5',
};

export const FROM_NM = {
  'C1001B': '주요 빨강', 'FF0000': '밝은 빨강', 'C00000': '다크 레드', 'DC2626': '강조 빨강',
  '5B21B6': '보라', 'A02B93': '다크 보라', '7030A0': '보라',
  '12CD80': '밝은 초록', '04CD80': '초록', '00B050': '초록',
  '065F46': '다크 초록', '4EA72E': '연두', '70AD47': '연두',
  'E97132': '오렌지', 'ED7D31': '오렌지', 'FFC000': '노랑', '0F9ED5': '하늘색',
  '404040': '중간 그레이', '374151': '다크 그레이', '6B7280': '슬레이트', '64748B': '슬레이트',
  '1A1A2E': '거의 검정', '0E2841': '다크 네이비', '44546A': 'MS 그레이', '4472C4': 'MS 블루',
};

export const KEEP = new Set([
  'FFFFFF', 'FEFEFE', 'FCFCFC', 'F8F8F8', 'F5F5F5', '000000', '010101',
  'F0F0F0', 'EEEEEE', 'FAFAFA', 'E7E6E6', 'EDEDED', 'D9D9D9'
]);

export function autoTo(h, palette) {
  const u = h.toUpperCase();
  if (KNOWN[u]) return KNOWN[u];
  if (KEEP.has(u)) return u;
  if (palette && palette.length) {
    const r1 = parseInt(u.slice(0, 2), 16),
          g1 = parseInt(u.slice(2, 4), 16),
          b1 = parseInt(u.slice(4, 6), 16);
    let best = null, bd = Infinity;
    for (const p of palette) {
      const hexVal = p.hex || p;
      const r2 = parseInt(hexVal.slice(0, 2), 16),
            g2 = parseInt(hexVal.slice(2, 4), 16),
            b2 = parseInt(hexVal.slice(4, 6), 16);
      const d = Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
      if (d < bd) { bd = d; best = hexVal; }
    }
    if (best && bd < 100) return best;
  }
  const r = parseInt(u.slice(0, 2), 16),
        g = parseInt(u.slice(2, 4), 16),
        b = parseInt(u.slice(4, 6), 16);
  if (r + g + b > 690) return u;
  if (r + g + b < 22) return '002060';
  if (r > g + 60 && r > b + 60) return r > 175 ? '2789F5' : '002060';
  if (g > r + 25 && g > b + 25) return '0DB364';
  if (b > r + 15 && b > g + 15) return b > 150 ? '1575E9' : '002060';
  if (Math.abs(r - g) < 28 && Math.abs(g - b) < 28) return '4F6D90';
  if (r > 175 && g > 80 && b < 90) return '5B9BD5';
  return '4F6D90';
}

export const palNm = (h, palette) => {
  const f = palette.find(p => p.hex.toUpperCase() === h.toUpperCase());
  return f ? f.name : '';
};

// 1. Extract Theme Colors from Zip
export async function extractThemeColors(zip) {
  const tk = Object.keys(zip.files).find(k => /ppt\/theme\/theme\d+\.xml$/.test(k));
  if (!tk) return {};
  const xml = await zip.files[tk].async('string');
  const result = {};
  const tokens = ['dk1', 'dk2', 'lt1', 'lt2', 'accent1', 'accent2', 'accent3', 'accent4', 'accent5', 'accent6', 'hlink', 'folHlink'];
  for (const t of tokens) {
    const m = xml.match(new RegExp('<a:' + t + '>\\s*<a:srgbClr val="([A-Fa-f0-9]{6})"'));
    const m2 = xml.match(new RegExp('<a:' + t + '>[\\s\\S]*?<a:sysClr[^>]*lastClr="([A-Fa-f0-9]{6})"'));
    if (m) result[t] = m[1].toUpperCase();
    else if (m2) result[t] = m2[1].toUpperCase();
  }
  return result;
}

// 2. Extract All Colors from Zip XML files
export async function extractColors(zip) {
  const xmlKeys = Object.keys(zip.files).filter(k => 
    k.endsWith('.xml') && 
    !zip.files[k].dir && 
    (k.startsWith('ppt/slides/') || k.startsWith('ppt/slideMasters/') || k.startsWith('ppt/slideLayouts/'))
  );
  const det = {};
  const sch = {};
  for (const k of xmlKeys) {
    const txt = await zip.files[k].async('string');
    let m;
    const r1 = /srgbClr val="([A-Fa-f0-9]{6})"/g;
    while ((m = r1.exec(txt)) !== null) {
      const h = m[1].toUpperCase();
      if (!det[h]) det[h] = { count: 0, fill: 0, line: 0, effect: 0, gradient: 0 };
      det[h].count++;
      const before = txt.substring(Math.max(0, m.index - 250), m.index);
      const tags = before.match(/<a:(outerShdw|innerShdw|glow|reflection|ln[ >]|gradFill|gs[ >])/g);
      if (tags && tags.length) {
        const last = tags[tags.length - 1];
        if (/Shdw|glow|reflection/.test(last)) det[h].effect++;
        else if (/a:ln/.test(last)) det[h].line++;
        else if (/gradFill|a:gs/.test(last)) det[h].gradient++;
        else det[h].fill++;
      } else det[h].fill++;
    }
    const r2 = /lastClr="([A-Fa-f0-9]{6})"/g;
    while ((m = r2.exec(txt)) !== null) {
      const h = m[1].toUpperCase();
      if (!det[h]) det[h] = { count: 0, fill: 0, line: 0, effect: 0, gradient: 0 };
      det[h].count++;
      det[h].fill++;
    }
    const r3 = /schemeClr val="([^"]+)"/g;
    while ((m = r3.exec(txt)) !== null) sch[m[1]] = (sch[m[1]] || 0) + 1;
  }
  return { det, sch };
}

// 3. Extract All Fonts from Zip XML files
export async function extractFonts(zip) {
  const xmlKeys = Object.keys(zip.files).filter(k => 
    k.endsWith('.xml') && 
    !zip.files[k].dir && 
    (k.startsWith('ppt/slides/') || k.startsWith('ppt/slideMasters/') || k.startsWith('ppt/slideLayouts/'))
  );
  const fontMap = {};
  const SKIP_FONTS = new Set([
    '+mj-lt', '+mn-lt', '+mj-ea', '+mn-ea', '+mj-cs', '+mn-cs',
    '+mj-hansi', '+mn-hansi', '+mj-bidi', '+mn-bidi', ''
  ]);
  for (const k of xmlKeys) {
    const txt = await zip.files[k].async('string');
    const re = /typeface="([^"]+)"/g;
    let m;
    while ((m = re.exec(txt)) !== null) {
      const tf = m[1];
      if (SKIP_FONTS.has(tf) || tf.startsWith('+')) continue;
      if (!fontMap[tf]) {
        fontMap[tf] = { 
          count: 0, 
          inSlides: false, 
          inMasters: false, 
          inTheme: false,
          sizes: new Set()
        };
      }
      fontMap[tf].count++;
      if (/ppt\/slides\/slide\d/.test(k)) fontMap[tf].inSlides = true;
      if (/slideMaster|slideLayout/.test(k)) fontMap[tf].inMasters = true;
      if (/theme/.test(k)) fontMap[tf].inTheme = true;

      // Search backwards in the XML for a size property (sz="...") within 250 characters
      const before = txt.substring(Math.max(0, m.index - 250), m.index);
      const szMatch = before.match(/sz="(\d+)"/g);
      if (szMatch) {
        const lastSz = szMatch[szMatch.length - 1];
        const valMatch = lastSz.match(/\d+/);
        if (valMatch) {
          const sizePt = parseInt(valMatch[0]) / 100;
          fontMap[tf].sizes.add(sizePt);
        }
      }
    }
  }

  // Convert sets to sorted arrays
  for (const tf of Object.keys(fontMap)) {
    fontMap[tf].sizes = Array.from(fontMap[tf].sizes).sort((a, b) => a - b);
  }

  return fontMap;
}

// Helper: parse individual components of a shape
export function parseFillXml(xml) {
  if (/<a:noFill\s*\/>/.test(xml)) return { type: 'none' };
  const solidM = xml.match(/<a:solidFill>[\s\S]*?<a:srgbClr val="([A-Fa-f0-9]{6})"/);
  if (solidM) return { type: 'solid', color: solidM[1].toUpperCase() };
  const schM = xml.match(/<a:solidFill>[\s\S]*?<a:schemeClr val="([^"]+)"/);
  if (schM) return { type: 'solid', color: schM[1] };
  if (xml.includes('<a:gradFill>')) {
    const stops = [];
    const re = /<a:gs pos="(\d+)">[\s\S]*?<a:srgbClr val="([A-Fa-f0-9]{6})"/g;
    let m;
    while ((m = re.exec(xml)) !== null) stops.push({ pos: (parseInt(m[1]) / 1000).toFixed(0) + '%', color: m[2].toUpperCase() });
    return { type: 'gradient', stops };
  }
  if (xml.includes('<a:pattFill>')) return { type: 'pattern' };
  if (xml.includes('<a:blipFill>')) return { type: 'image' };
  return null;
}

export function parseOutlineXml(xml) {
  const lnM = xml.match(/<a:ln(\s[^>]*)?>[\s\S]*?<\/a:ln>/);
  if (!lnM) return null;
  const lnFull = lnM[0];
  const lnAttrs = lnM[1] || '';
  if (lnFull.includes('<a:noFill/>')) return null;
  const wM = lnAttrs.match(/\bw="(\d+)"/);
  const colorM = lnFull.match(/<a:srgbClr val="([A-Fa-f0-9]{6})"/);
  const dashM = lnFull.match(/<a:prstDash val="([^"]+)"/);
  return {
    widthPt: wM ? (parseInt(wM[1]) / 12700).toFixed(2) : '0.75',
    color: colorM ? colorM[1].toUpperCase() : null,
    dash: dashM ? dashM[1] : 'solid'
  };
}

export function parseEffectsXml(xml) {
  const eff = {};
  const outerM = xml.match(/<a:outerShdw([^>]*)>([\s\S]*?)<\/a:outerShdw>/);
  if (outerM) {
    const a = outerM[1], inner = outerM[2];
    const cm = inner.match(/<a:srgbClr val="([A-Fa-f0-9]{6})"/);
    const am = inner.match(/<a:alpha val="(\d+)"/);
    const bm = a.match(/blurRad="(\d+)"/);
    const dm = a.match(/dist="(\d+)"/);
    const dirM = a.match(/dir="(\d+)"/);
    eff.shadow = {
      type: 'outer',
      blurPt: bm ? (parseInt(bm[1]) / 12700).toFixed(1) : 0,
      distPt: dm ? (parseInt(dm[1]) / 12700).toFixed(1) : null,
      dir: dirM ? (parseInt(dirM[1]) / 60000).toFixed(0) + '°' : null,
      color: cm ? cm[1].toUpperCase() : null,
      alpha: am ? (parseInt(am[1]) / 1000).toFixed(0) + '%' : null
    };
  }
  const innerM = xml.match(/<a:innerShdw([^>]*)>([\s\S]*?)<\/a:innerShdw>/);
  if (innerM && !eff.shadow) {
    const cm = innerM[2].match(/<a:srgbClr val="([A-Fa-f0-9]{6})"/);
    eff.shadow = { type: 'inner', color: cm ? cm[1].toUpperCase() : null };
  }
  const glowM = xml.match(/<a:glow rad="(\d+)">([\s\S]*?)<\/a:glow>/);
  if (glowM) {
    const cm = glowM[2].match(/<a:srgbClr val="([A-Fa-f0-9]{6})"/);
    eff.glow = { radPt: (parseInt(glowM[1]) / 12700).toFixed(1), color: cm ? cm[1].toUpperCase() : null };
  }
  const reflM = xml.match(/<a:reflection([^>]*)(?:\/>|>)/);
  if (reflM) {
    const a = reflM[1];
    const bm = a.match(/blurRad="(\d+)"/);
    const dm = a.match(/dist="(\d+)"/);
    eff.reflection = { blurPt: bm ? (parseInt(bm[1]) / 12700).toFixed(1) : null, distPt: dm ? (parseInt(dm[1]) / 12700).toFixed(1) : null };
  }
  const softM = xml.match(/<a:softEdge rad="(\d+)"/);
  if (softM) eff.softEdge = (parseInt(softM[1]) / 12700).toFixed(1);
  const bevelM = xml.match(/<a:bevelT([^>]*?)(?:\/>|>)/);
  if (bevelM) {
    const a = bevelM[1];
    const wm = a.match(/w="(\d+)"/), hm = a.match(/h="(\d+)"/), pm = a.match(/prst="([^"]+)"/);
    eff.bevel = { wPt: wm ? (parseInt(wm[1]) / 12700).toFixed(1) : '6', hPt: hm ? (parseInt(hm[1]) / 12700).toFixed(1) : '6', prst: pm ? pm[1] : 'circle' };
  }
  if (xml.includes('<a:bevelB')) eff.bevelB = true;
  const camM = xml.match(/<a:camera\s+prst="([^"]+)"/);
  if (camM) {
    eff.scene3d = { camera: camM[1] };
    const rotM = xml.match(/<a:camera[^>]*>\s*<a:rot lat="(-?\d+)" lon="(-?\d+)" rev="(-?\d+)"/);
    if (rotM) eff.scene3d.rot = { lat: (parseInt(rotM[1]) / 60000).toFixed(0), lon: (parseInt(rotM[2]) / 60000).toFixed(0), rev: (parseInt(rotM[3]) / 60000).toFixed(0) };
  }
  return eff;
}

// 4. Extract Shapes from slides
export async function extractShapesFromZip(zip) {
  const slideKeys = Object.keys(zip.files)
    .filter(k => /^ppt\/slides\/slide\d+\.xml$/.test(k))
    .sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));
  const shapes = [];
  for (const k of slideKeys) {
    const sn = parseInt(k.match(/\d+/)[0]);
    const txt = await zip.files[k].async('string');
    const spRe = /<p:sp\b>([\s\S]*?)<\/p:sp>/g;
    let m;
    while ((m = spRe.exec(txt)) !== null) {
      if (shapes.length >= 400) break;
      const sp = m[1];
      const idM = sp.match(/<p:cNvPr[^>]*\bid="(\d+)"/);
      const spId = idM ? idM[1] : '';
      const nameM = sp.match(/<p:cNvPr[^>]*\bname="([^"]+)"/);
      const name = nameM ? nameM[1] : '';
      const geomM = sp.match(/<a:prstGeom\s+prst="([^"]+)"/);
      const geom = geomM ? geomM[1] : (sp.includes('<a:custGeom>') ? 'custom' : '');
      const spPrM = sp.match(/<p:spPr\b[^>]*>([\s\S]*?)<\/p:spPr>/);
      if (!spPrM) continue;
      const spPr = spPrM[1];
      const fill = parseFillXml(spPr);
      const outline = parseOutlineXml(spPr);
      const effects = parseEffectsXml(spPr);
      const isShape = !!geom;
      const hasInterest =
        (fill && fill.type !== 'none') || (outline) ||
        effects.shadow || effects.glow || effects.bevel || effects.bevelB ||
        effects.reflection || effects.softEdge || effects.scene3d;
      if (!isShape && !hasInterest) continue;
      const lnM = spPr.match(/<a:ln\b[\s\S]*?<\/a:ln>/) || spPr.match(/<a:ln\b[^>]*\/>/);
      const efM = spPr.match(/<a:effectLst>[\s\S]*?<\/a:effectLst>/);
      shapes.push({
        slide: sn,
        spId,
        uid: sn + '_' + spId + '_' + shapes.length,
        name: name || '(unnamed)',
        geom,
        fill,
        outline,
        effects,
        lnXml: lnM ? lnM[0] : '',
        effectXml: efM ? efM[0] : '',
        assign: ''
      });
    }
    if (shapes.length >= 400) break;
  }
  return shapes;
}

// 5. XML Conversion Helpers
export function applyFontRunProps(txt, maps) {
  let sz = 0, bold = 0;
  txt = txt.replace(/<a:(rPr|defRPr|endParaRPr)\b((?:[^>]*[^/>])?)>([\s\S]*?)<\/a:\1>/g, (full, tag, attrs, inner) => {
    const tm = inner.match(/<a:(?:latin|ea|cs) typeface="([^"]+)"/);
    if (!tm) return full;
    const m = maps.find(x => x.from === tm[1]);
    if (!m) return full;
    let a = attrs;
    if (m.sizeScale && m.sizeScale !== 1) {
      a = a.replace(/\bsz="(\d+)"/, (mm, n) => {
        sz++;
        return 'sz="' + Math.max(100, Math.round(parseInt(n) * m.sizeScale)) + '"';
      });
    }
    if (m.boldMode === 'on') {
      a = /\bb="[01]"/.test(a) ? a.replace(/\bb="[01]"/, 'b="1"') : (' b="1"' + a);
      bold++;
    } else if (m.boldMode === 'off') {
      a = /\bb="[01]"/.test(a) ? a.replace(/\bb="[01]"/, 'b="0"') : (' b="0"' + a);
      bold++;
    }
    return '<a:' + tag + a + '>' + inner + '</a:' + tag + '>';
  });
  return { txt, sz, bold };
}

export function applyShapeOps(txt, ops) {
  let count = 0;
  if (ops.removeShadow) {
    txt = txt.replace(/<a:outerShdw\b[^>]*>[\s\S]*?<\/a:outerShdw>/g, () => { count++; return ''; });
    txt = txt.replace(/<a:outerShdw\b[^>]*\/>/g, () => { count++; return ''; });
    txt = txt.replace(/<a:innerShdw\b[^>]*>[\s\S]*?<\/a:innerShdw>/g, () => { count++; return ''; });
    txt = txt.replace(/<a:innerShdw\b[^>]*\/>/g, () => { count++; return ''; });
  }
  if (ops.removeGlow) {
    txt = txt.replace(/<a:glow\b[^>]*>[\s\S]*?<\/a:glow>/g, () => { count++; return ''; });
    txt = txt.replace(/<a:glow\b[^>]*\/>/g, () => { count++; return ''; });
  }
  if (ops.flattenGradient) {
    txt = txt.replace(/<a:gradFill\b[^>]*>([\s\S]*?)<\/a:gradFill>/g, (m, inner) => {
      const cm = inner.match(/<a:srgbClr val="([A-Fa-f0-9]{6})"/);
      if (cm) { count++; return '<a:solidFill><a:srgbClr val="' + cm[1] + '"/></a:solidFill>'; }
      const sm = inner.match(/<a:schemeClr val="([^"]+)"/);
      if (sm) { count++; return '<a:solidFill><a:schemeClr val="' + sm[1] + '"/></a:solidFill>'; }
      return m;
    });
  }
  if (ops.removeOutline) {
    // 도형 윤곽선(<a:ln>) 일괄 제거 → 명시적 <a:ln><a:noFill/></a:ln> 로 치환하여
    // 테마 상속 윤곽선까지 무력화. spPr 내 위치(순서)는 그대로 유지된다.
    // 주의: a:ln 만 매칭 — a:lnRef / a:lnL/R/T/B(표 테두리)는 \b 경계로 제외됨.
    txt = txt.replace(/<a:ln\b([^>]*)>[\s\S]*?<\/a:ln>/g, (m, attrs) => {
      if (/<a:noFill\s*\/>\s*<\/a:ln>$/.test(m)) return m; // 이미 noFill 이면 스킵
      count++;
      return '<a:ln' + attrs + '><a:noFill/></a:ln>';
    });
    txt = txt.replace(/<a:ln\b([^>]*)\/>/g, (m, attrs) => {
      count++;
      return '<a:ln' + attrs + '><a:noFill/></a:ln>';
    });
  }
  return { txt, count };
}

function _setAlphaInClr(s, av) {
  if (/<a:(srgbClr|schemeClr) val="[^"]+"\s*\/>/.test(s)) {
    return s.replace(/<a:(srgbClr|schemeClr) val="([^"]+)"\s*\/>/, (m, tag, val) => `<a:${tag} val="${val}"><a:alpha val="${av}"/></a:${tag}>`);
  }
  return s.replace(/<a:(srgbClr|schemeClr) val="([^"]+)">([\s\S]*?)<\/a:\1>/, (m, tag, val, inner) => {
    const ni = /<a:alpha val="\d+"\/>/.test(inner) ? inner.replace(/<a:alpha val="\d+"\/>/, `<a:alpha val="${av}"/>`) : (`<a:alpha val="${av}"/>` + inner);
    return `<a:${tag} val="${val}">${ni}</a:${tag}>`;
  });
}

export function applyShapeFillLine(txt, cfg) {
  let fillN = 0, lineN = 0;
  const fillOn = cfg.fillColorOn || cfg.fillAlphaOn;
  const lineOn = cfg.lineColorOn || cfg.lineAlphaOn || cfg.lineWidthOn;
  if (!fillOn && !lineOn) return { txt, fillN, lineN };
  txt = txt.replace(/(<p:spPr\b[^>]*>)([\s\S]*?)(<\/p:spPr>)/g, (full, open, inner, close) => {
    let s = inner;
    const lnM = s.match(/<a:ln[\s>\/]/);
    const lnIdx = lnM ? s.indexOf(lnM[0]) : -1;
    let fillPart = lnIdx >= 0 ? s.slice(0, lnIdx) : s;
    let rest = lnIdx >= 0 ? s.slice(lnIdx) : '';
    if (fillOn) {
      fillPart = fillPart.replace(/<a:solidFill>([\s\S]*?)<\/a:solidFill>/, (m, body) => {
        let nb = body;
        if (cfg.fillColorOn) {
          if (/<a:srgbClr val="[A-Fa-f0-9]{6}"/.test(nb)) nb = nb.replace(/(<a:srgbClr val=")[A-Fa-f0-9]{6}(")/, '$1' + cfg.fillColor.replace('#', '') + '$2');
          else if (/<a:schemeClr val="[^"]+"/.test(nb)) nb = nb.replace(/<a:schemeClr val="[^"]+"(?:\s*\/>|>[\s\S]*?<\/a:schemeClr>)/, '<a:srgbClr val="' + cfg.fillColor.replace('#', '') + '"/>');
        }
        if (cfg.fillAlphaOn) nb = _setAlphaInClr(nb, Math.round(cfg.fillAlpha * 1000));
        fillN++;
        return '<a:solidFill>' + nb + '</a:solidFill>';
      });
    }
    if (lineOn && rest) {
      if (/<a:ln\b[^>]*>[\s\S]*?<\/a:ln>/.test(rest)) {
        rest = rest.replace(/<a:ln\b([^>]*)>([\s\S]*?)<\/a:ln>/, (m, a, body) => {
          let na = a, nb = body;
          if (cfg.lineWidthOn) {
            const w = Math.round(cfg.lineWidth * 12700);
            na = /\bw="\d+"/.test(na) ? na.replace(/\bw="\d+"/, 'w="' + w + '"') : (' w="' + w + '"' + na);
          }
          if (cfg.lineColorOn) {
            const clr = '<a:solidFill><a:srgbClr val="' + cfg.lineColor.replace('#', '') + '"' + (cfg.lineAlphaOn ? '><a:alpha val="' + Math.round(cfg.lineAlpha * 1000) + '"/></a:srgbClr>' : '/>') + '</a:solidFill>';
            if (/<a:solidFill>[\s\S]*?<\/a:solidFill>/.test(nb)) nb = nb.replace(/<a:solidFill>[\s\S]*?<\/a:solidFill>/, clr);
            else if (/<a:noFill\s*\/>/.test(nb)) nb = nb.replace(/<a:noFill\s*\/>/, clr);
            else nb = clr + nb;
          } else if (cfg.lineAlphaOn) {
            nb = nb.replace(/<a:solidFill>([\s\S]*?)<\/a:solidFill>/, (mm, bd) => '<a:solidFill>' + _setAlphaInClr(bd, Math.round(cfg.lineAlpha * 1000)) + '</a:solidFill>');
          }
          lineN++;
          return '<a:ln' + na + '>' + nb + '</a:ln>';
        });
      } else if (/<a:ln\b[^>]*\/>/.test(rest)) {
        rest = rest.replace(/<a:ln\b([^>]*)\/>/, (m, a) => {
          let na = a, body = '';
          if (cfg.lineWidthOn) {
            const w = Math.round(cfg.lineWidth * 12700);
            na = /\bw="\d+"/.test(na) ? na.replace(/\bw="\d+"/, 'w="' + w + '"') : (' w="' + w + '"' + na);
          }
          if (cfg.lineColorOn) {
            body = '<a:solidFill><a:srgbClr val="' + cfg.lineColor.replace('#', '') + '"' + (cfg.lineAlphaOn ? '><a:alpha val="' + Math.round(cfg.lineAlpha * 1000) + '"/></a:srgbClr>' : '/>') + '</a:solidFill>';
          }
          if (!cfg.lineColorOn && !cfg.lineWidthOn) return m;
          lineN++;
          return '<a:ln' + na + '>' + body + '</a:ln>';
        });
      }
    }
    return open + fillPart + rest + close;
  });
  return { txt, fillN, lineN };
}

export function applyShapePresets(txt, assignMap, presets) {
  let count = 0;
  txt = txt.replace(/<p:sp\b>([\s\S]*?)<\/p:sp>/g, (full, inner) => {
    const idM = inner.match(/<p:cNvPr[^>]*\bid="(\d+)"/);
    if (!idM) return full;
    const pid = assignMap[idM[1]];
    if (!pid) return full;
    const preset = presets.find(p => p.id === pid);
    if (!preset) return full;
    const spPrM = inner.match(/<p:spPr\b[^>]*>[\s\S]*?<\/p:spPr>/);
    if (!spPrM) return full;
    let spPr = spPrM[0];
    spPr = spPr.replace(/<a:ln\b[\s\S]*?<\/a:ln>/g, '').replace(/<a:ln\b[^>]*\/>/g, '');
    spPr = spPr.replace(/<a:effectLst>[\s\S]*?<\/a:effectLst>/g, '').replace(/<a:effectLst\/>/g, '');
    const ins = (preset.lnXml || '') + (preset.effectXml || '');
    spPr = spPr.replace(/<\/p:spPr>/, ins + '</p:spPr>');
    count++;
    return full.replace(spPrM[0], spPr);
  });
  return { txt, count };
}

export function phToRule(type, idx) {
  if (type === 'title' || type === 'ctrTitle') return 'title';
  if (type === 'sldNum') return 'pageNum';
  if (type === 'subTitle') return 'chapter';
  if (type === 'body' || type === 'obj' || type === '') {
    if (idx === 1) return 'chapter';
    return 'body';
  }
  return null;
}

export function applyLayoutToXml(txt, rules) {
  let count = 0;
  txt = txt.replace(/<p:sp>([\s\S]*?)<\/p:sp>/g, (full, inner) => {
    const phM = inner.match(/<p:ph\b([^>]*?)\/?>/);
    if (!phM) return full;
    const a = phM[1];
    const typeM = a.match(/type="([^"]+)"/);
    const idxM = a.match(/idx="(\d+)"/);
    const rid = phToRule(typeM ? typeM[1] : '', idxM ? parseInt(idxM[1]) : 0);
    if (!rid) return full;
    const rule = rules.find(r => r.id === rid);
    if (!rule) return full;
    const ox = Math.round(rule.x * 12700),
          oy = Math.round(rule.y * 12700),
          cx = Math.round(rule.w * 12700),
          cy = Math.round(rule.h * 12700);
    let ni = inner, done = false;
    if (/<a:xfrm[\s>]/.test(inner)) {
      ni = inner.replace(/(<a:xfrm[^>]*>)[\s\S]*?(<\/a:xfrm>)/, (mm, o, c) => {
        done = true;
        return o + `<a:off x="${ox}" y="${oy}"/><a:ext cx="${cx}" cy="${cy}"/>` + c;
      });
    } else {
      const xfrm = `<a:xfrm><a:off x="${ox}" y="${oy}"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm>`;
      if (/<p:spPr\s*\/>/.test(inner)) {
        ni = inner.replace(/<p:spPr\s*\/>/, '<p:spPr>' + xfrm + '</p:spPr>');
        done = true;
      } else if (/<p:spPr\b[^>]*>/.test(inner)) {
        ni = inner.replace(/(<p:spPr\b[^>]*>)/, '$1' + xfrm);
        done = true;
      }
    }
    if (done) count++;
    return '<p:sp>' + ni + '</p:sp>';
  });
  return { txt, count };
}

// 6. Layout Analysis from Zip (extracting rules from slideMaster/slideLayout/first slides)
export async function doLayoutAnalysis(zip, defaultLayouts) {
  const phDefs = [
    { id: 'title', phTypes: ['title', 'ctrTitle'], idx: null },
    { id: 'chapter', phTypes: ['subTitle', 'body'], idx: 1 },
    { id: 'body', phTypes: ['body', 'obj'], idx: 2 },
    { id: 'pageNum', phTypes: ['sldNum'], idx: null },
  ];

  function parsePH(xml) {
    const phs = [];
    const re = /<p:sp>([\s\S]*?)<\/p:sp>/g;
    let m;
    while ((m = re.exec(xml)) !== null) {
      const sp = m[1];
      const phM = sp.match(/<p:ph(\s[^>]*)?>/);
      if (!phM) continue;
      const attrs = phM[1] || '';
      const typeM = attrs.match(/type="([^"]+)"/);
      const idxM = attrs.match(/idx="(\d+)"/);
      const offM = sp.match(/<a:off x="(\d+)" y="(\d+)"/);
      const extM = sp.match(/<a:ext cx="(\d+)" cy="(\d+)"/);
      if (offM && extM) {
        phs.push({
          type: typeM ? typeM[1] : 'body',
          idx: idxM ? parseInt(idxM[1]) : 0,
          x: parseInt(offM[1]),
          y: parseInt(offM[2]),
          cx: parseInt(extM[1]),
          cy: parseInt(extM[2])
        });
      }
    }
    return phs;
  }

  const xmlKeys = Object.keys(zip.files).filter(k => k.endsWith('.xml') && !zip.files[k].dir);
  const slidesToCheck = xmlKeys.filter(k => /^ppt\/slides\/slide\d+\.xml$/.test(k)).sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0])).slice(0, 5);
  const mastersToCheck = xmlKeys.filter(k => /slideMaster/.test(k));
  const layoutsToCheck = xmlKeys.filter(k => /slideLayout/.test(k)).slice(0, 4);
  const toCheck = [...slidesToCheck, ...mastersToCheck, ...layoutsToCheck];
  
  const found = {};
  for (const k of toCheck) {
    const xml = await zip.files[k].async('string');
    const phs = parsePH(xml);
    const src = k.includes('slide1') ? 'slide1' : k.includes('Master') ? 'master' : 'layout';
    for (const ph of phs) {
      for (const def of phDefs) {
        if (found[def.id]) continue;
        const tm = def.phTypes.includes(ph.type);
        const im = def.idx == null || (def.idx === 1 && ph.idx === 1) || (def.idx === 2 && ph.idx >= 2);
        if (tm && im) {
          found[def.id] = {
            x: Math.round(e2p(ph.x)),
            y: Math.round(e2p(ph.y)),
            w: Math.round(e2p(ph.cx)),
            h: Math.round(e2p(ph.cy)),
            source: src
          };
        }
      }
    }
    if (Object.keys(found).length === phDefs.length) break;
  }

  return defaultLayouts.map(r => {
    const f = found[r.id];
    return f ? { ...r, ...f, active: r.active } : { ...r };
  });
}
