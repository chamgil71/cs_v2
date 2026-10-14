/**
 * shortcode-styles/tables.mjs — 숏코드 CSS 부분: 비교표·시리즈 목차·level-grid·checkpoint·step-flow·takeaway.
 * shortcode-styles.mjs 의 SHORTCODE_CSS 가 순서대로 이어 붙인다(단일 출처는 그대로 — 바깥에서는 SHORTCODE_CSS 만 쓴다).
 */
export const TABLES_CSS = `  /* 비교표(Table) 세로형 가이드 스타일 고도화 */
  table { 
    width: 100%; 
    border-collapse: separate; 
    border-spacing: 0; 
    margin: 24px 0; 
    font-size: calc(0.9rem * var(--font-scale)); 
    border-radius: 8px; 
    overflow: hidden; 
    border: 1px solid var(--border); 
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }
  th { 
    background: var(--brand-light); 
    color: var(--brand-dark); 
    padding: 13px 16px; 
    font-weight: 800; 
    border-bottom: 2px solid var(--border); 
    border-right: 1px solid var(--border);
    text-align: center;
  }
  th:last-child {
    border-right: none;
  }
  td {
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    border-right: 1px solid var(--border);
    text-align: left;
    color: var(--text-2);
  }
  td:last-child {
    border-right: none;
  }
  tr:last-child td {
    border-bottom: none;
  }
  tr:nth-child(even) { 
    background: #fafbfc; 
  }
  tr:hover {
    background: rgba(99, 102, 241, 0.015);
  }

  /* ✓ 기호가 들어간 셀 자동 강조 */
  td.check-highlight { 
    color: var(--brand-dark); 
    font-weight: 800; 
    background: var(--brand-light); 
  }

  /* ── [NEW] 시리즈 목차 숏코드 컴포넌트 스타일 ── */
  .part-banner { margin-bottom: 30px; }
  .part-banner-header { display: flex; align-items: center; border-radius: var(--card-radius, var(--radius)); overflow: hidden; margin-bottom: 0; box-shadow: var(--card-shadow, var(--shadow)); }
  .part-banner-num-block { width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-family: var(--font-code); font-size: calc(11px * var(--font-scale)); font-weight: 500; color: white; background: var(--part-color, var(--brand)); }
  .part-banner-title-block { flex: 1; height: 52px; display: flex; align-items: center; padding: 0 20px; background: var(--part-color, var(--brand)); }
  .part-banner-title-text { font-family: var(--font-title); font-size: calc(15px * var(--font-scale)); font-weight: 600; color: white; }
  .part-banner-tagline { font-size: calc(11px * var(--font-scale)); color: rgba(255,255,255,0.7); margin-left: 12px; font-weight: 300; }
  .part-banner-chapter-range { font-family: var(--font-code); font-size: calc(10px * var(--font-scale)); color: rgba(255,255,255,0.5); margin-left: auto; letter-spacing: 0.05em; }

  .chapter-list { margin-top: 0; border-left: 2px solid var(--border); margin-left: 26px; padding-left: 15px; }
  .chapter-item { display: flex; align-items: baseline; padding: 10px 0; border-bottom: 1px solid var(--border); position: relative; transition: background 0.15s; }
  .chapter-item:last-child { border-bottom: none; }
  .chapter-num { font-family: var(--font-code); font-size: calc(11px * var(--font-scale)); color: var(--text-3); min-width: 38px; flex-shrink: 0; }
  .chapter-title { font-size: calc(14px * var(--font-scale)); color: var(--text-2); flex: 1; line-height: 1.45; }
  .chapter-title strong { font-weight: 600; color: var(--text); }
  .chapter-desc { font-size: calc(11px * var(--font-scale)); color: var(--text-3); margin-top: 2px; display: block; font-weight: 300; }
  .chapter-badge { font-family: var(--font-code); font-size: calc(10px * var(--font-scale)); padding: 2px 8px; border-radius: 100px; flex-shrink: 0; font-weight: 500; }

  .badge-concept   { background: #e8f0fe; color: #1a3a8c; }
  .badge-tool      { background: #f0fce8; color: #1a5c20; }
  .badge-case      { background: #fef3e8; color: #7c3a00; }
  .badge-guide     { background: #f8e8fe; color: #5c007c; }
  .badge-practice  { background: #e8fef3; color: #007c3a; }
  .badge-warn      { background: #fee8e8; color: #7c0000; }

  .summary-bar { margin-top: 40px; padding: 24px; background: var(--text); border-radius: var(--card-radius, var(--radius)); display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 20px; box-shadow: var(--card-shadow, var(--shadow)); }
  .summary-item { display: flex; flex-direction: column; gap: 4px; }
  .summary-num { font-family: var(--font-code); font-size: calc(28px * var(--font-scale)); font-weight: 700; color: var(--bg); line-height: 1; }
  .summary-num .unit { font-size: calc(12px * var(--font-scale)); font-weight: 300; color: rgba(255,255,255,0.6); margin-left: 2px; }
  .summary-label { font-size: calc(11px * var(--font-scale)); color: rgba(255,255,255,0.4); letter-spacing: 0.1em; text-transform: uppercase; font-weight: 500; }

  /* ── [NEW] level-grid, checkpoint-grid, step-flow, takeaway-banner 스타일 ── */
  .level-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin: 25px 0; }
  .level-card { background: var(--set-card-bg, var(--card-bg, #fff)); border: var(--card-border-width, 1px) solid var(--card-border-color, var(--border)); border-radius: var(--card-radius, var(--radius)); padding: 20px; text-align: center; box-shadow: var(--card-shadow, var(--shadow)); transition: all 0.2s ease; display: flex; flex-direction: column; justify-content: space-between; }
  .level-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
  .level-card.highlight { border-color: var(--brand); box-shadow: var(--shadow-lg); background: var(--brand-light); }
  .level-num { font-size: calc(1.25rem * var(--font-scale)); font-weight: 900; color: var(--brand); margin-bottom: 8px; }
  .level-card.highlight .level-num { color: var(--brand-dark); }
  .level-name { font-size: var(--size-card-title); font-weight: 700; color: var(--text); margin-bottom: 4px; }
  .level-name p { margin: 0; }
  .level-tool { font-size: var(--size-card-p); color: var(--text-2); font-weight: 500; margin-bottom: 8px; }
  .level-desc { font-size: calc(0.78rem * var(--font-scale)); color: var(--text-3); font-style: italic; margin-top: auto; border-top: 1px dashed var(--border); padding-top: 8px; }
  .level-desc p { margin: 0; }

  .checkpoint-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin: 25px 0; }
  .checkpoint-item { display: flex; align-items: center; gap: 16px; background: var(--set-card-bg, var(--card-bg, #fff)); border: var(--card-border-width, 1px) solid var(--card-border-color, var(--border)); border-radius: var(--card-radius, var(--radius)); padding: 18px; box-shadow: var(--card-shadow, var(--shadow)); transition: all 0.2s ease; }
  .checkpoint-item:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
  .ci-icon { font-size: calc(1.6rem * var(--font-scale)); display: flex; align-items: center; justify-content: center; flex-shrink: 0; width: 42px; height: 42px; background: var(--brand-light); border-radius: 50%; color: var(--brand); }
  .ci-text { font-size: var(--size-card-p); color: var(--text); line-height: 1.4; text-align: left; }
  .ci-text strong { font-size: var(--size-card-title); font-weight: 700; color: var(--brand-dark); }

  .step-flow { display: flex; align-items: stretch; gap: 15px; margin: 25px 0; overflow-x: auto; padding-bottom: 10px; }
  .step-flow-step { flex: 1; min-width: 140px; background: var(--set-card-bg, var(--card-bg, #fff)); border: var(--card-border-width, 1px) solid var(--card-border-color, var(--border)); border-radius: var(--card-radius, var(--radius)); padding: 20px; text-align: center; position: relative; display: flex; flex-direction: column; align-items: center; box-shadow: var(--card-shadow, var(--shadow)); }
  .step-flow-step.active { border-color: var(--brand); box-shadow: var(--shadow-lg); }
  .step-flow-step.active .fs-icon { background: var(--brand); color: #fff; }
  .fs-icon { width: 45px; height: 45px; margin: 0 auto 10px; background: var(--brand-light); color: var(--brand); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: calc(1.3rem * var(--font-scale)); }
  .fs-title { font-weight: 800; font-size: var(--size-card-title); margin-bottom: 5px; color: var(--text); }
  .fs-sub { font-size: var(--size-card-p); color: var(--text-2); margin: 0; }
  .fs-sub p { margin: 0; }
  .step-flow-arrow { display: flex; align-items: center; justify-content: center; font-weight: 900; color: #cbd5e1; font-size: calc(1.5rem * var(--font-scale)); flex-shrink: 0; user-select: none; }

  .takeaway-banner {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    padding: 24px;
    background: linear-gradient(135deg, var(--brand-light) 0%, rgba(255,255,255,0.9) 100%);
    border-left: 5px solid var(--brand);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    margin: 25px 0;
  }
  .ta-icon {
    font-size: calc(1.8rem * var(--font-scale));
    line-height: 1.2;
    flex-shrink: 0;
  }
  .ta-label {
    font-size: var(--size-card-title);
    font-weight: 800;
    color: var(--brand-dark);
    margin-bottom: 6px;
    text-align: left;
  }
  .ta-text {
    font-size: var(--size-card-p);
    color: var(--text-2);
    line-height: 1.6;
    text-align: left;
  }
  .ta-text p {
    margin: 0;
  }
`;
