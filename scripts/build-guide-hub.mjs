#!/usr/bin/env node
/**
 * build-guide-hub.mjs
 * md_src/guides/*.md 전체를 오프라인에서도 열리는 단일 HTML "가이드 허브"로 묶는다.
 * (사이드바 카테고리 내비 + 각 가이드 본문을 Shadow DOM에 렌더링하는 SPA 셸)
 * 셸 UI는 과거 수작업 산출물 publish/ai_guide_standalone.html 의 구조를 그대로 재현하되,
 * 콘텐츠는 guide-core.mjs(정본 렌더러)로 현재 md_src/guides 원본에서 매번 새로 생성한다.
 *
 * 사용법: node scripts/build-guide-hub.mjs [--dir <md_src 하위 폴더명>] [--out path.html ...]
 *   --out 을 여러 번 지정하면 같은 내용을 여러 경로에 동시 출력한다.
 *   기본 출력: publish/<dir>-onepage.html (기본 --dir 은 guides → publish/guides-onepage.html)
 *   카테고리 라벨·순서·사이드바 기본 상태는 md_src/<dir>/hub.config.json(없으면 안전한 기본값)에서 읽는다.
 *
 *   ⚠️ "onepage"라는 이름: 이 산출물은 md 여러 개의 본문을 전부 문자열로 내장한 "콘텐츠 뭉치" 1개 파일이다.
 *   `npm run build:standalone`이 만드는 dist/webdesignsuite.html 등은 React 앱(편집 로직 포함) 자체를
 *   번들링한 "앱 뭉치"라 전혀 다른 산출물이다 — 이름이 겹치던 걸 2026-09-02에 이렇게 분리했다.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { buildHtml } from "./guide-core.mjs";
import { loadHubConfig, categoryMetaFor, sortByCategoryOrder, resolveFolderDir } from "./hub-config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function loadJsonWithComments(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const src = fs.readFileSync(filePath, "utf8").replace(/\/\/[^\n]*/g, "").replace(/\/\*[\s\S]*?\*\//g, "");
  return JSON.parse(src);
}

const CONFIG_DIR = path.join(ROOT, "config");
const STYLES = loadJsonWithComments(path.join(CONFIG_DIR, "styles.json"));
const CONFIG = loadJsonWithComments(path.join(CONFIG_DIR, "pptdesign.config.json"));
const HTML_CONFIG = loadJsonWithComments(path.join(CONFIG_DIR, "htmldesign.config.json"));

function walkMd(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".md"))
    .map((e) => path.join(dir, e.name))
    .sort((a, b) => a.localeCompare(b, "ko"));
}

function slugify(name) {
  return name.trim().toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9가-힣._-]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// guide-core 가 만든 전체 페이지 HTML에서 <style> 본문과 <body> 본문만 추출 (Shadow DOM에 그대로 주입하기 위함)
function extractStylesAndBody(fullHtml) {
  const styleMatch = fullHtml.match(/<style>([\s\S]*?)<\/style>/);
  const bodyMatch = fullHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/);
  return {
    styles: styleMatch ? styleMatch[1] : "",
    body: bodyMatch ? bodyMatch[1] : fullHtml,
  };
}

function buildData(folder = "guides") {
  const { srcDir: guidesDir } = resolveFolderDir(ROOT, folder);
  const files = walkMd(guidesDir);
  if (!files.length) {
    throw new Error(`${path.relative(ROOT, guidesDir)} 안에 .md 파일이 없습니다. (--dir 옵션으로 다른 폴더를 지정했다면 경로를 확인하세요)`);
  }
  const hubConfig = loadHubConfig(guidesDir);
  const byCategory = new Map();
  const guideContents = {};

  for (const file of files) {
    const base = path.basename(file, ".md");
    const raw = fs.readFileSync(file, "utf8");
    const { data: fm } = matter(raw);
    const styleKey = String(fm.style || "uncategorized").trim() || "uncategorized";
    const title = String(fm.title || base).replace(/\s+/g, " ").trim();
    const subtitle = String(fm.subtitle || "").replace(/\s+/g, " ").trim();
    const slug = slugify(base);

    const { html } = buildHtml({ raw }, { styles: STYLES, config: CONFIG, htmlConfig: HTML_CONFIG });
    guideContents[slug] = extractStylesAndBody(html);

    if (!byCategory.has(styleKey)) byCategory.set(styleKey, []);
    byCategory.get(styleKey).push({ slug, title, subtitle });
  }

  const styleIds = sortByCategoryOrder([...byCategory.keys()], hubConfig);

  const categories = styleIds.map((id) => {
    const meta = categoryMetaFor(hubConfig, id);
    const guides = byCategory.get(id).sort((a, b) => a.title.localeCompare(b.title, "ko"));
    return { id, label: meta.label, description: meta.description || "", color: meta.color, guides };
  });

  return {
    categories,
    collections: [],
    guideContents,
    collectionContents: {},
    ui: { sidebarDefaultOpen: hubConfig.sidebar.defaultOpen },
  };
}

const HEAD = `<!doctype html>
<html lang="ko" data-theme="light">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>AI 가이드 허브 (오프라인)</title>
<style>
  html[data-theme="dark"]{--bg:#0b0d12;--panel:#11141b;--panel-2:#161a23;--border:#222836;--fg:#e6e8ee;--muted:#8a93a6;--accent:#6366f1;--main-bg:#fff;--main-fg:#111;--footer-bg:#fafafa;--footer-border:#eee;--footer-btn-bg:#fff;--footer-btn-border:#ddd;--footer-btn-hover:#f0f0f0;}
  html[data-theme="light"]{--bg:#f7f8fb;--panel:#ffffff;--panel-2:#f0f2f7;--border:#e3e6ee;--fg:#1a1d24;--muted:#5b6473;--accent:#6366f1;--main-bg:#fff;--main-fg:#111;--footer-bg:#fafafa;--footer-border:#eee;--footer-btn-bg:#fff;--footer-btn-border:#ddd;--footer-btn-hover:#f0f0f0;}
  *{box-sizing:border-box}
  html,body{margin:0;padding:0;width:100%;height:100%;overflow:hidden;background:var(--bg);color:var(--fg);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Pretendard","Noto Sans KR",sans-serif;}
  a{color:inherit}
  .sa-header{height:53px;background:color-mix(in srgb,var(--bg) 90%,transparent);backdrop-filter:blur(8px);border-bottom:1px solid var(--border);}
  .sa-bar{display:flex;align-items:center;gap:12px;padding:12px 20px;}
  .sa-bar h1{font-size:16px;margin:0;font-weight:700}
  .sa-crumb{color:var(--muted);font-size:14px}
  .sa-bar button{background:var(--panel-2);color:var(--fg);border:1px solid var(--border);padding:6px 12px;border-radius:8px;cursor:pointer;font-size:13px}
  .sa-bar button:hover{background:color-mix(in srgb,var(--panel-2) 70%,var(--accent) 10%)}
  .sa-toolbar{display:flex;gap:8px;margin-left:auto}
  .sa-layout{display:grid;grid-template-columns:280px minmax(0,1fr);height:calc(100vh - 53px);min-height:0;}
  .sa-layout.sa-sidebar-collapsed{grid-template-columns:0 minmax(0,1fr)}
  .sa-layout.sa-sidebar-collapsed .sa-sidebar{display:none}
  .sa-sidebar{border-right:1px solid var(--border);background:var(--panel);overflow-y:auto;min-height:0;}
  .sa-cat{padding:12px 16px 4px;color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:.08em;display:flex;align-items:center;gap:8px}
  .sa-dot{width:8px;height:8px;border-radius:50%;flex:0 0 auto}
  .sa-nav a,.sa-nav button{display:block;width:100%;text-align:left;padding:6px 16px 6px 32px;font-size:14px;line-height:1.45;color:var(--muted);text-decoration:none;cursor:pointer;background:none;border:none;font-family:inherit}
  .sa-nav a:hover,.sa-nav button:hover{background:var(--panel-2);color:var(--fg)}
  .sa-nav a.active,.sa-nav button.active{background:var(--panel-2);color:var(--fg);font-weight:600;border-left:3px solid var(--accent);padding-left:29px}
  #main.sa-main{overflow-y:auto;min-height:0;background:var(--main-bg);color:var(--main-fg);}
  .sa-home{background:var(--bg);color:var(--fg);min-height:100%}
  .sa-hero{position:relative;overflow:hidden;padding:56px 32px 40px;border-bottom:1px solid var(--border)}
  .sa-hero::before{content:'';position:absolute;inset:0;opacity:.08;background:linear-gradient(135deg,var(--accent),#8b5cf6);pointer-events:none}
  .sa-hero-inner{position:relative;max-width:760px}
  .sa-hero-badge{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--border);background:var(--panel);padding:4px 12px;border-radius:999px;font-size:12px;color:var(--muted);margin-bottom:18px}
  .sa-hero-title{font-size:clamp(28px,4vw,42px);font-weight:800;line-height:1.18;margin:0}
  .sa-hero-title .grad{background:linear-gradient(135deg,var(--accent),#8b5cf6);-webkit-background-clip:text;background-clip:text;color:transparent}
  .sa-hero-desc{margin:18px 0 0;color:var(--muted);font-size:15px;max-width:600px;line-height:1.6}
  .sa-hero-controls{margin-top:26px;display:flex;flex-wrap:wrap;gap:10px}
  .sa-search-wrap{position:relative;flex:1;min-width:220px}
  .sa-search-wrap .sa-search-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);pointer-events:none;font-size:14px;opacity:.7}
  .sa-search-wrap input{width:100%;height:46px;padding:0 14px 0 38px;border-radius:10px;border:1px solid var(--border);background:var(--panel);color:var(--fg);font-size:14px;font-family:inherit}
  .sa-search-wrap input:focus{outline:2px solid var(--accent);outline-offset:1px}
  .sa-cta-btn{height:46px;padding:0 20px;border-radius:10px;border:none;background:var(--accent);color:#fff;font-weight:700;font-size:14px;cursor:pointer;white-space:nowrap;font-family:inherit}
  .sa-cta-btn:hover{opacity:.9}
  .sa-pill-row{margin-top:20px;display:flex;flex-wrap:wrap;gap:8px}
  .sa-pill{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--border);background:var(--panel);padding:7px 14px;border-radius:999px;font-size:13px;color:var(--fg);cursor:pointer;font-family:inherit}
  .sa-pill:hover{border-color:var(--accent)}
  .sa-pill .sa-pill-n{color:var(--muted)}
  .sa-home-body{padding:40px 32px}
  .sa-cat-block{margin-bottom:44px;scroll-margin-top:16px}
  .sa-cat-head{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;border-bottom:1px solid var(--border);padding-bottom:14px;margin-bottom:18px}
  .sa-cat-id{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);font-family:ui-monospace,Consolas,monospace}
  .sa-cat-head h3{font-size:19px;margin:4px 0 0;display:flex;align-items:center;gap:8px}
  .sa-cat-desc{color:var(--muted);font-size:13px;margin:4px 0 0}
  .sa-cat-count{color:var(--muted);font-size:13px;white-space:nowrap}
  .sa-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}
  .sa-card{position:relative;overflow:hidden;background:var(--panel);border:1px solid var(--border);border-radius:12px;padding:18px 16px 16px;cursor:pointer;transition:transform .15s,border-color .15s,box-shadow .15s}
  .sa-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--card-accent,var(--accent))}
  .sa-card:hover{transform:translateY(-2px);border-color:var(--accent);box-shadow:0 8px 20px rgba(0,0,0,.08)}
  .sa-card-row{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}
  .sa-card .sa-t{font-weight:700;font-size:14.5px;margin-bottom:4px}
  .sa-card .sa-s{color:var(--muted);font-size:13px;line-height:1.45}
  .sa-card-arrow{flex:0 0 auto;color:var(--muted);transition:transform .15s}
  .sa-card:hover .sa-card-arrow{transform:translateX(3px);color:var(--fg)}
  .sa-empty{padding:60px 0;text-align:center;color:var(--muted)}
  .sa-home-footer{margin-top:24px;padding-top:20px;border-top:1px solid var(--border);display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;color:var(--muted);font-size:13px}
  .sa-guide-wrap{min-height:calc(100% - 66px);background:transparent;color:inherit}
  .sa-guide-host{display:block}
  .sa-message{padding:24px 32px;max-width:1100px;margin:0 auto}
  .sa-footer-nav{display:flex;justify-content:space-between;gap:16px;padding:16px 32px;border-top:1px solid var(--footer-border);background:var(--footer-bg)}
  .sa-footer-nav button{background:var(--footer-btn-bg);border:1px solid var(--footer-btn-border);padding:8px 14px;border-radius:8px;cursor:pointer;color:#111}
  .sa-footer-nav button:hover{background:var(--footer-btn-hover)}
  @media (max-width:800px){.sa-layout{grid-template-columns:1fr}.sa-sidebar{display:none}}
  @media print{
    html,body{height:auto;overflow:visible;background:#fff;color:#000}
    .sa-header,.sa-sidebar,.sa-footer-nav{display:none!important}
    .sa-layout{display:block;height:auto;min-height:0}
    #main.sa-main{display:block;overflow:visible;height:auto;max-height:none;background:#fff;color:#000}
    .sa-guide-wrap{min-height:0;background:transparent;color:inherit}
    .sa-guide-host{display:block}
  }
</style>
</head>
<body>
<header class="sa-header">
  <div class="sa-bar">
    <button id="menuToggleBtn" title="메뉴 열기/닫기">☰</button>
    <button id="homeBtn">🏠 홈</button>
    <h1>AI 가이드 허브</h1>
    <span class="sa-crumb" id="crumb"></span>
    <div class="sa-toolbar">
      <button id="themeBtn" title="테마 전환">☀️ 라이트</button>
      <button id="printBtn" style="display:none">🖨 인쇄 / PDF</button>
    </div>
  </div>
</header>
<div class="sa-layout" id="layout">
  <aside class="sa-sidebar" id="sidebar"></aside>
  <main class="sa-main" id="main"></main>
</div>
`;

const TAIL = `<script>
const DATA = JSON.parse(document.getElementById('appdata').textContent);
const main = document.getElementById('main');
const sidebar = document.getElementById('sidebar');
const layout = document.getElementById('layout');
const crumb = document.getElementById('crumb');
const printBtn = document.getElementById('printBtn');
const themeBtn = document.getElementById('themeBtn');
const homeBtn = document.getElementById('homeBtn');
const menuToggleBtn = document.getElementById('menuToggleBtn');
let currentShadow = null;

function applySidebarState(open){
  layout.classList.toggle('sa-sidebar-collapsed', !open);
}
let sidebarOpen = DATA.ui && typeof DATA.ui.sidebarDefaultOpen === 'boolean' ? DATA.ui.sidebarDefaultOpen : true;
try {
  const saved = localStorage.getItem('onepage-sidebar');
  if (saved !== null) sidebarOpen = saved === 'open';
} catch (_) {}
applySidebarState(sidebarOpen);
menuToggleBtn.addEventListener('click',()=>{
  sidebarOpen = !sidebarOpen;
  applySidebarState(sidebarOpen);
  try { localStorage.setItem('onepage-sidebar', sidebarOpen ? 'open' : 'closed'); } catch (_) {}
});

function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\\"":"&quot;","'":"&#39;"}[c]))}

function normalizeTheme(value){return value==='dark'?'dark':'light'}

function applyTheme(theme){
  const next = normalizeTheme(theme);
  document.documentElement.dataset.theme = next;
  themeBtn.textContent = next==='dark'?'🌙 다크':'☀️ 라이트';
}

try {
  applyTheme(localStorage.getItem('onepage-theme') || 'light');
} catch (_) {
  applyTheme('light');
}

themeBtn.addEventListener('click',()=>{
  const next = document.documentElement.dataset.theme==='dark'?'light':'dark';
  applyTheme(next);
  try { localStorage.setItem('onepage-theme', next); } catch (_) {}
});

function renderSidebar(activeKey){
  let html = '<div class="sa-nav">';
  for(const c of DATA.categories){
    html += '<div class="sa-cat"><span class="sa-dot" style="background:'+c.color+'"></span>'+escapeHtml(c.label)+'</div>';
    for(const g of c.guides){
      const cls = activeKey==='guide:'+g.slug?'active':'';
      html += '<a class="'+cls+'" data-key="guide:'+g.slug+'">'+escapeHtml(g.title)+'</a>';
    }
  }
  for(const col of DATA.collections){
    html += '<div class="sa-cat"><span class="sa-dot" style="background:'+col.color+'"></span>'+escapeHtml(col.label)+'</div>';
    for(const p of col.parts){
      const key = 'col:'+col.id+':'+p.slug;
      const cls = activeKey===key?'active':'';
      html += '<a class="'+cls+'" data-key="'+key+'">'+escapeHtml(p.title)+'</a>';
    }
  }
  html += '</div>';
  sidebar.innerHTML = html;
  sidebar.querySelectorAll('a[data-key]').forEach(el=>el.addEventListener('click',()=>route(el.dataset.key)));
}

function totalGuideCount(){
  return DATA.categories.reduce((n,c)=>n+c.guides.length,0);
}

function cardHtml(key,title,subtitle,accent){
  return '<div class="sa-card" data-key="'+key+'" style="--card-accent:'+accent+'" data-q="'+escapeHtml((title+' '+subtitle).toLowerCase())+'">'
    +'<div class="sa-card-row"><div><div class="sa-t">'+escapeHtml(title)+'</div>'
    +(subtitle?'<div class="sa-s">'+escapeHtml(subtitle)+'</div>':'')
    +'</div><span class="sa-card-arrow">→</span></div></div>';
}

function showHome(){
  currentShadow = null;
  crumb.textContent=''; printBtn.style.display='none';

  let html = '<div class="sa-home">';
  html += '<section class="sa-hero"><div class="sa-hero-inner">';
  html += '<div class="sa-hero-badge">✨ 한국어로 정리한 도구 가이드 모음</div>';
  html += '<h2 class="sa-hero-title">AI · 생산성 도구를<br><span class="grad">카테고리별로 빠르게</span></h2>';
  html += '<p class="sa-hero-desc">'+escapeHtml(totalGuideCount()+'개 도구 가이드를 그룹으로 모아 한 화면에서 탐색하고 바로 읽어볼 수 있습니다. 인터넷 없이도 작동합니다.')+'</p>';
  html += '<div class="sa-hero-controls">';
  html += '<div class="sa-search-wrap"><span class="sa-search-icon">🔍</span><input id="homeSearch" type="text" placeholder="도구 이름이나 카테고리 검색..." /></div>';
  html += '<button class="sa-cta-btn" id="heroStartBtn">탐색 시작 →</button>';
  html += '</div>';
  html += '<div class="sa-pill-row">';
  for(const c of DATA.categories){
    html += '<button class="sa-pill" data-scroll="cat-'+c.id+'"><span class="sa-dot" style="background:'+c.color+'"></span>'+escapeHtml(c.label)+' <span class="sa-pill-n">'+c.guides.length+'</span></button>';
  }
  html += '</div></div></section>';

  html += '<div class="sa-home-body">';
  for(const c of DATA.categories){
    html += '<div class="sa-cat-block" id="cat-'+c.id+'" data-kind="category">';
    html += '<div class="sa-cat-head"><div><div class="sa-cat-id">'+escapeHtml(c.id)+'</div><h3><span class="sa-dot" style="background:'+c.color+'"></span>'+escapeHtml(c.label)+'</h3>'
      +(c.description?'<p class="sa-cat-desc">'+escapeHtml(c.description)+'</p>':'')+'</div>';
    html += '<span class="sa-cat-count">'+c.guides.length+'개 가이드</span></div>';
    html += '<div class="sa-cards">';
    for(const g of c.guides){
      html += cardHtml('guide:'+g.slug, g.title, g.subtitle, c.color);
    }
    html += '</div></div>';
  }
  if(DATA.collections.length){
    html += '<div class="sa-cat-block" data-kind="extra"><div class="sa-cat-head"><div><div class="sa-cat-id">series</div><h3>시리즈 가이드</h3></div></div><div class="sa-cards">';
    for(const col of DATA.collections){
      html += '<div class="sa-cat-block" style="margin-bottom:20px"><h3 style="font-size:15px;margin-bottom:8px"><span class="sa-dot" style="background:'+col.color+'"></span>'+escapeHtml(col.label)+'</h3><div class="sa-cards">';
      for(const p of col.parts){
        html += cardHtml('col:'+col.id+':'+p.slug, p.title, '', col.color);
      }
      html += '</div></div>';
    }
    html += '</div></div>';
  }
  html += '<p class="sa-empty" id="homeEmpty" style="display:none">검색 결과가 없습니다.</p>';
  html += '<div class="sa-home-footer"><span>© AI 가이드 허브 — 오프라인에서도 작동합니다</span><span>'+totalGuideCount()+'개의 가이드</span></div>';
  html += '</div></div>';

  main.innerHTML = html;
  main.querySelectorAll('.sa-card').forEach(el=>el.addEventListener('click',()=>route(el.dataset.key)));
  main.querySelectorAll('[data-scroll]').forEach(el=>el.addEventListener('click',()=>{
    const target = document.getElementById(el.dataset.scroll);
    if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
  }));
  const searchInput = document.getElementById('homeSearch');
  const startBtn = document.getElementById('heroStartBtn');
  if(startBtn) startBtn.addEventListener('click',()=>{
    const first = DATA.categories[0];
    if(first){ const target=document.getElementById('cat-'+first.id); if(target) target.scrollIntoView({behavior:'smooth',block:'start'}); }
  });
  if(searchInput) searchInput.addEventListener('input',()=>applyHomeFilter(searchInput.value));
  renderSidebar(null);
}

function applyHomeFilter(query){
  const q = query.trim().toLowerCase();
  let anyVisible = false;
  main.querySelectorAll('.sa-cat-block[data-kind="category"]').forEach((block)=>{
    let blockMatch = false;
    block.querySelectorAll('.sa-card').forEach((card)=>{
      const match = !q || (card.dataset.q||'').includes(q);
      card.style.display = match ? '' : 'none';
      if(match) blockMatch = true;
    });
    block.style.display = blockMatch ? '' : 'none';
    if(blockMatch) anyVisible = true;
  });
  main.querySelectorAll('.sa-cat-block[data-kind="extra"]').forEach((block)=>{
    block.style.display = q ? 'none' : '';
  });
  const empty = document.getElementById('homeEmpty');
  if(empty) empty.style.display = (q && !anyVisible) ? 'block' : 'none';
}

function normalizeGuideStyles(css){
  return String(css || '')
    .replace(/(^|[,{}])\\s*:root\\b/gm, '$1:host')
    .replace(/(^|[,{}])\\s*html\\b/gm, '$1:host')
    .replace(/(^|[,{}])\\s*body\\b/gm, '$1.guide-document');
}

function renderShadowContent(host, content){
  currentShadow = host.attachShadow({mode:'open'});
  const baseCss = [
    ':host{display:block;background:transparent;color:inherit;}',
    '.guide-document{display:block;min-height:100%;background:var(--bg,#fff);color:var(--text,#111);}',
    '.guide-document *{box-sizing:border-box;}',
    '@media print{:host{display:block;background:transparent!important;color:inherit!important}.guide-document{min-height:0!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}.nav,.back-top,#backTop{display:none!important}}',
  ].join('\\n');
  currentShadow.innerHTML = '<style>'+baseCss+'\\n'+normalizeGuideStyles(content.styles)+'</style><div class="guide-document">'+content.body+'</div>';
  currentShadow.addEventListener('click',(event)=>{
    const path = event.composedPath();
    const link = path.find((node)=>node && node.tagName === 'A' && node.getAttribute);
    if(!link) return;
    const href = link.getAttribute('href') || '';
    if(href.startsWith('#')){
      event.preventDefault();
      const id = decodeURIComponent(href.slice(1));
      const target = id ? currentShadow.getElementById(id) : currentShadow.getElementById('top');
      if(target) main.scrollTo({top:target.offsetTop,behavior:'smooth'});
      else main.scrollTo({top:0,behavior:'smooth'});
    }
  });
}

function flatNav(){
  const all = [];
  for(const c of DATA.categories) for(const g of c.guides) all.push({key:'guide:'+g.slug,title:g.title});
  for(const col of DATA.collections) for(const p of col.parts) all.push({key:'col:'+col.id+':'+p.slug,title:p.title});
  return all;
}

function showContent(key){
  let content=null,title='',crumbText='';
  if(key.startsWith('guide:')){
    const slug=key.slice(6);
    let cat=null,guide=null;
    for(const c of DATA.categories){const g=c.guides.find(x=>x.slug===slug);if(g){cat=c;guide=g;break;}}
    if(!guide) return showHome();
    content=DATA.guideContents[slug]; title=guide.title;
    crumbText=' / '+cat.label+' / '+guide.title;
  } else if(key.startsWith('col:')){
    const [,colId,partSlug]=key.split(':');
    const col=DATA.collections.find(c=>c.id===colId); if(!col) return showHome();
    const part=col.parts.find(p=>p.slug===partSlug); if(!part) return showHome();
    content=DATA.collectionContents[colId]&&DATA.collectionContents[colId][partSlug];
    title=part.title; crumbText=' / '+col.label+' / '+part.title;
  }
  if(!content){currentShadow=null;main.innerHTML='<div class="sa-message"><p>콘텐츠를 찾을 수 없습니다.</p></div>';return}
  crumb.textContent=crumbText; printBtn.style.display='inline-block';
  const all=flatNav(); const i=all.findIndex(x=>x.key===key);
  const prev=i>0?all[i-1]:null; const next=i<all.length-1?all[i+1]:null;
  let html='<div class="sa-guide-wrap"><div class="sa-guide-host" id="guideHost"></div></div>';
  html += '<div class="sa-footer-nav">';
  html += prev?'<button data-key="'+prev.key+'">← '+escapeHtml(prev.title)+'</button>':'<span></span>';
  html += next?'<button data-key="'+next.key+'">'+escapeHtml(next.title)+' →</button>':'<span></span>';
  html += '</div>';
  main.innerHTML=html;
  renderShadowContent(document.getElementById('guideHost'), content);
  main.querySelectorAll('.sa-footer-nav button[data-key]').forEach(b=>b.addEventListener('click',()=>route(b.dataset.key)));
  renderSidebar(key); main.scrollTop=0; location.hash='#'+encodeURIComponent(key);
}

function route(key){if(!key) showHome(); else showContent(key)}

homeBtn.addEventListener('click',()=>{location.hash=''; showHome()});
printBtn.addEventListener('click',()=>window.print());
window.addEventListener('hashchange',()=>{const s=decodeURIComponent(location.hash.replace('#',''));if(s)showContent(s);else showHome()});

const initial=decodeURIComponent(location.hash.replace('#',''));
if(initial) showContent(initial); else showHome();
</script>
</body>
</html>
`;

// 이 스크립트의 산출물은 사이드바+홈이 한 HTML 파일 안에 다 들어가고, 외부 파일 참조 없이
// 서버 없이도(파일 더블클릭으로도) 바로 열리는 "onepage" 단일 파일 허브다.
// --out 을 명시하지 않았을 때 쓰는 기본 파일명은 폴더명이 바뀌어도(--dir) 항상 이 표시가 붙도록 여기 한 곳에서 만든다.
function defaultOutPath(folder) {
  const { outBase } = resolveFolderDir(ROOT, folder);
  return path.join("publish", `${outBase}-onepage.html`);
}

function render(folder = "guides") {
  const data = buildData(folder);
  // </script> 조기 종료 및 <!-- 주입 방지: '<' 를 전부 유니코드 이스케이프
  const safeJson = JSON.stringify(data).replace(/</g, "\\u003c");
  return `${HEAD}\n<script id="appdata" type="application/json">${safeJson}</script>\n${TAIL}`;
}

const isMain = fileURLToPath(import.meta.url) === path.resolve(process.argv[1] || "");
if (isMain) {
  const argv = process.argv.slice(2);
  const outPaths = [];
  let folder = "guides";
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--out") outPaths.push(argv[++i]);
    else if (argv[i] === "--dir") folder = argv[++i];
    else if (argv[i] === "--help" || argv[i] === "-h") {
      console.log([
        "",
        "사용법:",
        "  node scripts/build-guide-hub.mjs [--dir <md_src 하위 폴더명>] [--out path.html ...]",
        "",
        "옵션:",
        "  --dir <name>   md_src/<name>/*.md 전체를 허브로 병합 (기본: guides)",
        "  --out <path>   출력 경로. 여러 번 지정하면 동일 내용을 여러 경로에 동시 출력",
        `                 (기본: ${defaultOutPath("<name>")})`,
        "",
      ].join("\n"));
      process.exit(0);
    }
  }
  if (!outPaths.length) outPaths.push(defaultOutPath(folder));

  const html = render(folder);
  for (const outPath of outPaths) {
    const abs = path.resolve(ROOT, outPath);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, html, "utf8");
    console.log(`✅ 가이드 허브(독립 HTML) 생성 완료 [md_src/${folder}]: ${path.relative(ROOT, abs)}`);
  }
}

export { buildData, render };
