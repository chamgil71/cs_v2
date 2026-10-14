/**
 * shortcode-styles/diagrams.mjs — 숏코드 CSS 부분: 벤·사분면·동심원·mermaid·마무리·푸터·전후 비교·알림·명령·탭·FAQ·통계·흐름 화살표.
 * shortcode-styles.mjs 의 SHORTCODE_CSS 가 순서대로 이어 붙인다(단일 출처는 그대로 — 바깥에서는 SHORTCODE_CSS 만 쓴다).
 */
export const DIAGRAMS_CSS = `  /* [NEW] Venn Diagram */
  .venn-diagram { position: relative; height: 240px; margin: 25px 0; display: flex; align-items: center; justify-content: center; }
  .venn-circle { position: absolute; width: 200px; height: 200px; border-radius: 50%; border: 2px solid; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 20px; }
  .venn-left { left: calc(50% - 160px); }
  .venn-right { left: calc(50% - 40px); }
  .venn-label { font-family: var(--font-title); font-weight: 800; font-size: calc(1.05rem * var(--font-scale)); }
  .venn-center { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; max-width: 140px; }
  .venn-center-icon { font-size: calc(2rem * var(--font-scale)); }
  .venn-center-desc { font-family: var(--font-desc), sans-serif; font-weight: 700; font-size: calc(0.85rem * var(--font-scale)); color: var(--text); }

  /* [NEW] Quadrant Chart */
  .quadrant-chart { display: grid; grid-template-columns: auto 1fr; grid-template-rows: 1fr auto; gap: 10px; margin: 25px 0; }
  .quadrant-axis-y { grid-column: 1; grid-row: 1; writing-mode: vertical-rl; transform: rotate(180deg); text-align: center; font-family: var(--font-desc), sans-serif; font-weight: 700; font-size: calc(0.85rem * var(--font-scale)); color: var(--text-2); }
  .quadrant-axis-x { grid-column: 2; grid-row: 2; text-align: center; font-family: var(--font-desc), sans-serif; font-weight: 700; font-size: calc(0.85rem * var(--font-scale)); color: var(--text-2); }
  .quadrant-plot { grid-column: 2; grid-row: 1; position: relative; height: 280px; background: var(--set-card-bg, var(--card-bg, #fff)); border: var(--card-border-width, 1px) solid var(--card-border-color, var(--border)); border-radius: var(--card-radius, var(--radius)); box-shadow: var(--card-shadow, var(--shadow)); }
  .quadrant-gridline { position: absolute; background: var(--border); }
  .quadrant-gridline-h { left: 0; right: 0; top: 50%; height: 1px; }
  .quadrant-gridline-v { top: 0; bottom: 0; left: 50%; width: 1px; }
  .quadrant-point { position: absolute; transform: translate(-50%, 50%); display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .quadrant-dot { width: 14px; height: 14px; border-radius: 50%; border: 2px solid var(--card-bg, #fff); box-shadow: 0 0 0 1px rgba(0,0,0,0.08); }
  .quadrant-point-label { font-family: var(--font-desc), sans-serif; font-weight: 700; font-size: calc(0.78rem * var(--font-scale)); white-space: nowrap; }

  /* [NEW] Concentric Rings */
  .concentric-rings { display: flex; flex-direction: column; align-items: center; gap: 18px; margin: 25px 0; }
  .rings-visual { position: relative; width: 220px; height: 220px; }
  .ring { position: absolute; top: 50%; left: 50%; border-radius: 50%; transform: translate(-50%, -50%); opacity: 0.9; }
  .ring-depth-0 { width: 220px; height: 220px; }
  .ring-depth-1 { width: 176px; height: 176px; }
  .ring-depth-2 { width: 132px; height: 132px; }
  .ring-depth-3 { width: 88px;  height: 88px; }
  .ring-depth-4 { width: 60px;  height: 60px; }
  .ring-depth-5 { width: 40px;  height: 40px; }
  .ring-center-icon { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: calc(1.4rem * var(--font-scale)); }
  .rings-legend { display: flex; flex-wrap: wrap; gap: 10px 18px; justify-content: center; }
  .ring-legend-item { display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-desc), sans-serif; font-weight: 700; font-size: calc(0.82rem * var(--font-scale)); color: var(--text-2); }
  .ring-legend-item i { display: inline-block; width: 10px; height: 10px; border-radius: 50%; }

  /* [NEW] Mermaid 구조도 — mermaid.js 가 <pre class="mermaid"> 안의 원문을 SVG 로 치환 */
  .mermaid { display: flex; justify-content: center; margin: 25px 0; overflow-x: auto; }

  /* Done section */
  .done-section { background: linear-gradient(135deg, var(--brand-deep), var(--brand)); color: white; padding: 72px 24px; text-align: center; }
  .done-section h2 { font-family: var(--font-title); font-size: calc(clamp(1.8rem, 4vw, 2.6rem) * var(--font-scale)); margin-bottom: 10px; }
  .done-section p { color: var(--done-subtitle-color, rgba(255,255,255,0.86)); margin-bottom: 24px; }
  .done-link { display: inline-flex; align-items: center; background: white; color: var(--brand-dark); font-weight: 800; padding: 13px 24px; border-radius: 100px; text-decoration: none; box-shadow: var(--shadow-lg); }

  /* Back to top */
  .back-top { position: fixed; bottom: 32px; right: 32px; width: 46px; height: 46px; background: var(--brand); color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; text-decoration: none; box-shadow: var(--shadow-lg); font-size: 20px; transition: all .2s; }
  .back-top:hover { background: var(--brand-dark); transform: translateY(-2px); }

  /* Footer */
  footer { text-align: center; padding: 40px 24px; color: var(--text-3); font-size: .85rem; border-top: 1px solid var(--border); margin-top: 40px; }
  footer a { color: var(--brand); text-decoration: none; }

  /* Compare Diff (Before-After / 1:1) */
  .compare-diff {
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    margin: 25px 0;
  }
  .before-box, .after-box {
    display: flex;
    flex-direction: column;
    gap: 8px;
    text-align: left;
  }
  .before-box {
    border-bottom: 1px solid var(--border);
    padding-bottom: 20px;
  }
  .ba-label {
    font-family: var(--font-desc);
    font-weight: 800;
    font-size: var(--size-card-title);
    color: var(--text);
  }
  .ba-content {
    font-family: var(--font-desc);
    font-size: var(--size-card-p);
    color: var(--text-2);
    line-height: 1.6;
  }

  /* Alert Box */
  .alert-box { display: flex; gap: 14px; padding: 16px 20px; border-radius: var(--card-radius, var(--radius)); border-left: 4px solid var(--alert-color, var(--brand)); background: color-mix(in srgb, var(--alert-color, var(--brand)) 8%, white); margin: 20px 0; }
  .alert-tip  { --alert-color: var(--brand); }
  .alert-warn { --alert-color: #F59E0B; }
  .alert-success { --alert-color: #22C55E; }
  .alert-danger { --alert-color: #EF4444; }
  .alert-icon { font-size: calc(1.3rem * var(--font-scale)); flex-shrink: 0; line-height: 1.5; }
  .alert-body strong { display: block; font-size: var(--size-card-title); font-weight: 800; color: var(--alert-color, var(--brand)); margin-bottom: 4px; }
  .alert-body p { margin: 0; font-size: calc(0.92rem * var(--font-scale)); color: var(--text-2); }

  /* Command Block */
  .cmd-block { background: #0F172A; border-radius: var(--card-radius, var(--radius)); overflow: hidden; margin: 20px 0; }
  .cmd-header { display: flex; align-items: center; gap: 8px; padding: 9px 16px; background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.07); }
  .cmd-label { font-size: calc(0.8rem * var(--font-scale)); color: rgba(255,255,255,0.5); font-family: var(--font-code); flex: 1; }
  .cmd-lang { font-size: calc(0.75rem * var(--font-scale)); color: var(--brand); font-family: var(--font-code); }
  .cmd-copy { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 3px 10px; font-size: calc(0.75rem * var(--font-scale)); cursor: pointer; transition: 0.15s; font-family: inherit; }
  .cmd-copy:hover { background: rgba(255,255,255,0.16); color: white; }
  .cmd-pre { margin: 0; padding: 18px 20px; background: transparent; color: #CBD5E1; font-size: calc(0.92rem * var(--font-scale)); overflow-x: auto; border-radius: 0; white-space: pre-wrap; word-break: break-all; }
  .cmd-pre code { background: none; padding: 0; font-size: inherit; }

  /* Tabs */
  .tabs-wrap { margin: 25px 0; border: var(--card-border-width, 1px) solid var(--card-border-color, var(--border)); border-radius: var(--card-radius, var(--radius)); overflow: hidden; }
  .tabs-nav { display: flex; background: var(--bg); border-bottom: 1px solid var(--border); overflow-x: auto; }
  .tab-btn { padding: 11px 20px; background: transparent; border: none; border-bottom: 2px solid transparent; cursor: pointer; font-size: calc(0.9rem * var(--font-scale)); font-weight: 600; color: var(--text-2); white-space: nowrap; transition: 0.15s; font-family: inherit; margin-bottom: -1px; }
  .tab-btn.active { color: var(--brand); border-bottom-color: var(--brand); background: white; }
  .tab-btn:hover:not(.active) { color: var(--text); background: rgba(0,0,0,0.03); }
  .tab-panel { display: none; padding: 24px; background: var(--set-card-bg, var(--card-bg, #fff)); }
  .tab-panel.active { display: block; }
  .tab-panel p { margin-bottom: 0.8rem; }

  /* FAQ Accordion */
  .faq-list { display: flex; flex-direction: column; gap: 8px; margin: 25px 0; }
  .faq-item { background: var(--set-card-bg, var(--card-bg, #fff)); border: var(--card-border-width, 1px) solid var(--card-border-color, var(--border)); border-radius: var(--card-radius, var(--radius)); overflow: hidden; transition: border-color 0.15s; }
  .faq-item.open { border-color: var(--brand); }
  .faq-q { width: 100%; display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; background: transparent; border: none; cursor: pointer; font-size: var(--size-card-title); font-weight: 700; color: var(--text); text-align: left; gap: 12px; font-family: inherit; transition: background 0.15s; }
  .faq-q:hover { background: var(--brand-light); }
  .faq-item.open .faq-q { color: var(--brand-dark); background: var(--brand-light); }
  .faq-arrow { transition: transform 0.2s; font-size: calc(0.7rem * var(--font-scale)); opacity: 0.5; flex-shrink: 0; }
  .faq-item.open .faq-arrow { transform: rotate(180deg); opacity: 1; }
  .faq-a { display: none; padding: 0 20px 16px; }
  .faq-item.open .faq-a { display: block; }
  .faq-a p { margin: 0; font-size: var(--size-card-p); color: var(--text-2); }

  /* Prompt Example */
  .prompt-box { background: #0F172A; border-radius: var(--card-radius, var(--radius)); overflow: hidden; margin: 20px 0; }
  .prompt-label { padding: 9px 16px; background: var(--brand); color: white; font-size: calc(0.82rem * var(--font-scale)); font-weight: 700; letter-spacing: 0.03em; }
  .prompt-content { display: block; margin: 0; padding: 18px 20px; color: #CBD5E1; font-family: var(--font-code); font-size: calc(0.88rem * var(--font-scale)); white-space: pre-wrap; line-height: 1.9; background: transparent; border-radius: 0; }

  /* Stat Highlight */
  .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; margin: 25px 0; }
  .stat-card { background: var(--set-card-bg, var(--card-bg, #fff)); border: var(--card-border-width, 1px) solid var(--card-border-color, var(--border)); border-radius: var(--card-radius, var(--radius)); padding: 24px 16px; text-align: center; box-shadow: var(--card-shadow, var(--shadow)); transition: 0.2s; }
  .stat-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
  .stat-val { font-size: calc(var(--size-stat-val) * var(--font-scale)); font-weight: 900; color: var(--brand); font-family: var(--font-title); margin-bottom: 6px; line-height: 1.1; }
  .stat-name { font-weight: 700; font-size: calc(var(--size-stat-name) * var(--font-scale)); margin-bottom: 4px; }
  .stat-note { font-size: calc(var(--size-stat-note) * var(--font-scale)); color: var(--text-3); }

  /* Misc */
  .compare-note { margin-top: 15px; padding: 8px; background: var(--brand-light); color: var(--brand-dark); text-align: center; font-size: calc(0.85rem * var(--font-scale)); font-weight: bold; border-radius: 8px; }
  blockquote { background: var(--brand-light); border-left: 4px solid var(--brand); border-radius: var(--radius); padding: 14px 18px; margin: 14px 0; color: var(--brand-dark); }
  blockquote p { margin: 0; color: var(--brand-dark); }
  pre { background: #1a1a2e; color: #fff; padding: 20px; border-radius: 10px; overflow-x: auto; }
  code { font-family: var(--font-code); font-size: calc(0.9em * var(--font-scale)); }
  
  /* Flow Arrow Separator (↓, →, ↑, ←) Styles */
  .flow-arrow-separator {
    text-align: center;
    font-size: 1.8rem;
    font-weight: 900;
    margin: 20px 0;
    color: var(--brand);
    text-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
    animation: guideFlowBounce 2s infinite;
  }
  @keyframes guideFlowBounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }

`;
