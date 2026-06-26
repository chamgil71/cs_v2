/**
 * shortcode-styles.mjs — 숏코드 컴포넌트 CSS 정본(공유).
 * build-guide 의 컴포넌트 CSS 를 추출. var(--*) 기반으로 테마 독립.
 * 각 셸(guide/presentation/client)이 :root 변수(--card-bg, --text, --border, --size-* 등)를
 * 자기 테마/프로파일에 맞게 정의하고 이 CSS 를 포함한다.
 * 카드 배경은 var(--card-bg, #fff) — guide=라이트(#fff), presentation/client=다크.
 */
export const SHORTCODE_CSS = `
  /* 공통 카드 스타일 */
  .card-top-bar { height: 4px; background: var(--brand); position: absolute; top: 0; left: 0; right: 0; }
  .feature-card { padding: 18px; }
  
  /* Grid Systems */
  .icon-grid, .feature-grid, .compare-grid, .plan-grid, .columns-grid { display: grid; gap: 20px; margin: 25px 0; }
  .icon-grid { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
  .feature-grid { grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }
  .plan-grid { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); }
  .compare-grid { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
  .columns-grid { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
  .badge-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 15px; margin: 25px 0;}

  /* Cards */
  .icon-card, .feature-card, .compare-card, .column-card, .plan-card, .summary-box, .badge-item { 
    background: var(--card-bg, #fff); border: 1px solid var(--border); border-radius: var(--radius); padding: 25px;
    position: relative; overflow: hidden; transition: 0.2s; box-shadow: var(--shadow);
  }
  .icon-card:hover, .feature-card:hover, .plan-card:hover { transform: translateY(-5px); box-shadow: 0 12px 30px rgba(0,0,0,0.08); }
  
  
  .icon-card-icon { font-size: calc(2.5rem * var(--font-scale)); margin-bottom: 15px; text-align: center; }
  .icon-card-title, .feature-card-title, .compare-card-title, .col-title, .plan-title, .bl-title { 
    font-family: var(--font-title); font-weight: 800; font-size: calc(var(--size-card-title) * var(--font-scale)); margin-bottom: 10px; color: var(--text); 
  }
  .icon-card-title { text-align: center; }
  .fc-icon { margin-right: 8px; font-size: calc(1.2rem * var(--font-scale)); }
  .feature-tag { position: absolute; top: 15px; right: 15px; font-size: calc(0.75rem * var(--font-scale)); font-weight: 900; padding: 4px 12px; border-radius: 100px; background: var(--brand-light); color: var(--brand-dark); }
  p { color: var(--text-2); font-size: calc(var(--size-body-p) * var(--font-scale)); margin-bottom: 1rem; }
  .icon-card p, .feature-card p, .compare-card p, .column-card p, .plan-card p, .summary-box p, .stat-card p, .stat-note p {
    font-size: calc(var(--size-card-p) * var(--font-scale));
  }
  .icon-card p { text-align: center; }

  /* Tool Card */
  .tool-card { border-radius: var(--radius); overflow: hidden; border: 1px solid var(--border); box-shadow: var(--shadow); margin: 25px 0; }
  .tc-header { padding: 25px; display: flex; align-items: center; gap: 20px; }
  .tc-icon { width: 55px; height: 55px; border-radius: calc(var(--radius) / 2); background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: calc(1.8rem * var(--font-scale)); }
  .tc-content { flex: 1; min-width: 0; }
  .tc-name { font-size: calc(var(--size-card-title) * var(--font-scale)); font-weight: 800; }
  .tc-sub { font-size: calc(var(--size-card-p) * var(--font-scale)); opacity: 0.9; }
  .tc-badge { margin-left: auto; font-size: calc(0.8rem * var(--font-scale)); font-weight: 800; padding: 5px 15px; border-radius: 100px; background: rgba(255,255,255,0.25); }
  .tc-list { padding: 12px 25px 14px 40px; font-size: calc(var(--size-card-p) * var(--font-scale)); background: var(--bg); border-top: 1px solid var(--border); color: var(--text-2); margin: 0; line-height: 1.9; }

  /* Workflow */
  .workflow-flow { display: flex; gap: 15px; margin: 25px 0; overflow-x: auto; padding-bottom: 10px; }
  .wf-step { flex: 1; min-width: 140px; background: var(--card-bg, #fff); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; text-align: center; position: relative; }
  .wf-icon { width: 45px; height: 45px; margin: 0 auto 10px; background: var(--brand-light); color: var(--brand); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: calc(1.3rem * var(--font-scale)); }
  .wf-name { font-weight: 800; font-size: calc(var(--size-card-title) * var(--font-scale)); margin-bottom: 5px; }
  .wf-tool { font-size: calc(var(--size-card-p) * var(--font-scale)); color: var(--text-2); }
  .wf-arrow { position: absolute; right: -15px; top: 50%; transform: translateY(-50%); font-weight: 900; color: #cbd5e1; z-index: 1; font-size: calc(1.2rem * var(--font-scale)); }

  /* Steps */
  .step-list { display: flex; flex-direction: column; gap: 15px; margin: 25px 0; }
  .step-item { display: flex; gap: 20px; background: var(--card-bg, #fff); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; box-shadow: var(--shadow); }
  .step-num { width: 35px; height: 35px; background: var(--brand); color: #fff; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 900; flex-shrink: 0; }
  .step-content { flex: 1; min-width: 0; }
  .step-title { font-weight: 800; font-size: calc(var(--size-card-title) * var(--font-scale)); margin-bottom: 5px; }

  /* Plan Grid */
  .plan-card { text-align: center; padding-top: 35px; }
  .plan-featured { border-color: var(--brand); box-shadow: 0 8px 30px rgba(99,102,241,0.15); transform: translateY(-5px); }
  .plan-badge { position: absolute; top: 15px; left: 50%; transform: translateX(-50%); background: var(--brand); color: #fff; font-size: calc(var(--size-plan-badge) * var(--font-scale)); font-weight: 900; padding: 4px 15px; border-radius: 100px; }
  .plan-title { margin-bottom: 20px; }
  .plan-features { list-style: none; margin: 0 0 20px 0; padding: 0; text-align: left; }
  .plan-features li { padding: 8px 0; border-bottom: 1px solid var(--border); font-size: calc(var(--size-plan-features) * var(--font-scale)); color: var(--text-2); }
  .plan-features li:before { content: '✓'; color: var(--brand); margin-right: 8px; font-weight: bold; }
  .plan-note { margin-top: auto; padding: 8px; background: var(--brand-light); color: var(--brand-dark); font-size: calc(0.85rem * var(--font-scale)); font-weight: bold; border-radius: 8px; }

  /* Skill List */
  .skill-list { display: flex; flex-direction: column; gap: 15px; margin: 25px 0; }
  .skill-item { display: flex; align-items: center; gap: 20px; background: var(--card-bg, #fff); border: 1px solid var(--border); border-radius: var(--radius); padding: 15px 25px; }
  .skill-icon { width: 40px; height: 40px; background: var(--brand-light); color: var(--brand); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: calc(1.2rem * var(--font-scale)); flex-shrink: 0; }
  .skill-title { font-weight: 800; font-size: calc(var(--size-card-title) * var(--font-scale)); width: 30%; }
  .skill-desc { font-size: calc(var(--size-card-p) * var(--font-scale)); color: var(--text-2); flex: 1; margin: 0; }

  /* Badge Grid */
  .badge-item { text-align: center; padding: 20px 15px; }
  .badge-icon { font-size: calc(2rem * var(--font-scale)); margin-bottom: 10px; }
  .badge-title { font-weight: 800; font-size: calc(var(--size-card-title) * var(--font-scale)); margin-bottom: 5px; }
  .badge-tag { font-size: calc(0.8rem * var(--font-scale)); color: var(--text-2); }

  /* Bottom List */
  .bl-chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
  .bl-chip { background: var(--brand-light); color: var(--brand-dark); font-size: calc(0.85rem * var(--font-scale)); font-weight: 800; padding: 6px 15px; border-radius: 100px; }

  /* Compare 2Col */
  .compare-2col { display: flex; gap: 20px; margin: 25px 0; }
  .c2-card { flex: 1; background: var(--card-bg, #fff); border: 1px solid var(--border); border-radius: var(--radius); padding: 30px; position: relative; overflow: hidden; box-shadow: var(--shadow); }
  .c2-left { background: var(--brand-light); border-color: var(--brand); border-width: 2px; }
  .c2-left .card-top-bar { background: var(--brand); }
  .c2-right .card-top-bar { background: var(--text-2); }
  .c2-title { font-size: calc(var(--size-card-title) * var(--font-scale)); font-weight: 800; margin-bottom: 20px; color: var(--brand-dark); }
  .c2-right .c2-title { color: var(--text); }
  .c2-list { list-style: none; margin: 0; padding: 0; }
  .c2-list li { padding: 8px 0; font-size: calc(var(--size-card-p) * var(--font-scale)); color: var(--text-2); display: flex; gap: 10px; }
  .c2-left .c2-list li { color: var(--brand-dark); }
  .c2-list li:before { content: '•'; font-weight: bold; }
  .c2-note { margin-top: 20px; padding: 10px; background: var(--brand); color: #fff; font-size: calc(0.85rem * var(--font-scale)); font-weight: bold; text-align: center; border-radius: 8px; }
  .c2-right .c2-note { background: var(--border); color: var(--text); }
  @media(max-width: 768px) { .compare-2col { flex-direction: column; } }

  /* [NEW] Git flow (다차원 깃 플로우 브랜치 흐름 시각화) */
  .git-flow-container { background: #0F172A; padding: 28px; border-radius: var(--radius); border: 1px solid rgba(255,255,255,0.08); margin: 25px 0; overflow-x: auto; }
  .flow-branches { display: flex; flex-direction: column; gap: 20px; min-width: 600px; }
  .branch-row { display: grid; grid-template-columns: 140px 1fr; gap: 20px; align-items: center; min-height: 80px; }
  .branch-label { padding: 8px 16px; border-radius: 8px; font-family: var(--font-code); font-size: calc(0.9rem * var(--font-scale)); text-align: center; }
  .branch-line { display: flex; align-items: center; justify-content: flex-start; flex: 1; height: 32px; position: relative; padding: 0 10%; }
  .commit { width: 18px; height: 18px; background: #0F172A; border: 3px solid var(--brand); border-radius: 50%; position: relative; cursor: pointer; transition: 0.2s; flex-shrink: 0; }
  .commit:hover { transform: scale(1.25); }
  .commit-label { position: absolute; bottom: 24px; left: 50%; transform: translateX(-50%); color: #fff; font-size: calc(0.72rem * var(--font-scale)); font-weight: 800; padding: 2px 8px; border-radius: 100px; white-space: nowrap; font-family: var(--font-code); }
  .commit-desc { position: absolute; top: 24px; left: 50%; transform: translateX(-50%); color: #94A3B8; font-size: calc(0.72rem * var(--font-scale)); white-space: nowrap; font-family: inherit; font-weight: 500; }
  .commit-line-segment { flex: 1; height: 3px; min-width: 30px; }

  /* [NEW] Editor Box */
  .editor-sim { background: #1E1E1E; border: 1px solid #333; border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow-lg); margin: 25px 0; }
  .editor-titlebar { background: #2D2D2D; height: 38px; display: flex; align-items: center; padding: 0 16px; gap: 8px; border-bottom: 1px solid #252526; }
  .editor-dot { width: 12px; height: 12px; border-radius: 50%; }
  .editor-dot.red { background: #FF5F56; }
  .editor-dot.yellow { background: #FFBD2E; }
  .editor-dot.green { background: #27C93F; }
  .editor-tab { background: #1E1E1E; color: #8F8F8F; height: 100%; display: flex; align-items: center; padding: 0 20px; font-size: calc(0.85rem * var(--font-scale)); font-family: var(--font-code); border-right: 1px solid #252526; margin-left: 12px; border-top: 2px solid transparent; }
  .editor-tab.active { color: #fff; border-top-color: var(--brand); }
  .editor-body { display: grid; grid-template-columns: 48px 1fr; font-family: var(--font-code); font-size: calc(0.9rem * var(--font-scale)); line-height: 1.8; color: #D4D4D4; min-height: 150px; }
  .line-nums { background: #1E1E1E; color: #858585; text-align: right; padding: 18px 12px 18px 0; border-right: 1px solid #3c3c3c; user-select: none; display: flex; flex-direction: column; }
  .code-area { padding: 18px 24px; overflow-x: auto; background: #1E1E1E; }
  .code-area pre { margin: 0; padding: 0; background: transparent; }

  /* [NEW] Network Box */
  .graph-visual { background: #0A0F1E; border-radius: var(--radius); border: 1px solid rgba(255,255,255,0.06); height: 280px; position: relative; margin: 25px 0; overflow: hidden; }
  .graph-nodes { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
  .node { position: absolute; border-radius: 100px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: var(--font-desc), sans-serif; font-size: calc(0.82rem * var(--font-scale)); font-weight: 700; transition: all 0.3s ease; text-align: center; }
  .node-main { width: 90px; height: 90px; color: #fff; font-size: calc(1rem * var(--font-scale)); z-index: 5; animation: pulseGlow 3s infinite ease-in-out; }
  .node-1 { width: 75px; height: 75px; transform: translate(-150px, -50px); animation: driftOne 8s infinite ease-in-out; }
  .node-2 { width: 70px; height: 70px; transform: translate(150px, 60px); animation: driftTwo 9s infinite ease-in-out; }
  .node-3 { width: 70px; height: 70px; transform: translate(-100px, 90px); animation: driftThree 10s infinite ease-in-out; }
  .node-4 { width: 75px; height: 75px; transform: translate(110px, -80px); animation: driftFour 11s infinite ease-in-out; }
  .node:hover { transform: scale(1.15) !important; z-index: 10; cursor: pointer; box-shadow: 0 0 20px rgba(255,255,255,0.15); }
  @keyframes pulseGlow { 0%, 100% { transform: scale(1); opacity: 0.95; } 50% { transform: scale(1.06); opacity: 1; } }
  @keyframes driftOne { 0%, 100% { transform: translate(-150px, -50px); } 50% { transform: translate(-145px, -42px); } }
  @keyframes driftTwo { 0%, 100% { transform: translate(150px, 60px); } 50% { transform: translate(142px, 68px); } }
  @keyframes driftThree { 0%, 100% { transform: translate(-100px, 90px); } 50% { transform: translate(-106px, 84px); } }
  @keyframes driftFour { 0%, 100% { transform: translate(110px, -80px); } 50% { transform: translate(116px, -74px); } }

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
  .alert-box { display: flex; gap: 14px; padding: 16px 20px; border-radius: var(--radius); border-left: 4px solid var(--alert-color, var(--brand)); background: color-mix(in srgb, var(--alert-color, var(--brand)) 8%, white); margin: 20px 0; }
  .alert-tip  { --alert-color: var(--brand); }
  .alert-warn { --alert-color: #F59E0B; }
  .alert-success { --alert-color: #22C55E; }
  .alert-danger { --alert-color: #EF4444; }
  .alert-icon { font-size: calc(1.3rem * var(--font-scale)); flex-shrink: 0; line-height: 1.5; }
  .alert-body strong { display: block; font-size: var(--size-card-title); font-weight: 800; color: var(--alert-color, var(--brand)); margin-bottom: 4px; }
  .alert-body p { margin: 0; font-size: calc(0.92rem * var(--font-scale)); color: var(--text-2); }

  /* Command Block */
  .cmd-block { background: #0F172A; border-radius: var(--radius); overflow: hidden; margin: 20px 0; }
  .cmd-header { display: flex; align-items: center; gap: 8px; padding: 9px 16px; background: rgba(255,255,255,0.04); border-bottom: 1px solid rgba(255,255,255,0.07); }
  .cmd-label { font-size: calc(0.8rem * var(--font-scale)); color: rgba(255,255,255,0.5); font-family: var(--font-code); flex: 1; }
  .cmd-lang { font-size: calc(0.75rem * var(--font-scale)); color: var(--brand); font-family: var(--font-code); }
  .cmd-copy { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; padding: 3px 10px; font-size: calc(0.75rem * var(--font-scale)); cursor: pointer; transition: 0.15s; font-family: inherit; }
  .cmd-copy:hover { background: rgba(255,255,255,0.16); color: white; }
  .cmd-pre { margin: 0; padding: 18px 20px; background: transparent; color: #CBD5E1; font-size: calc(0.92rem * var(--font-scale)); overflow-x: auto; border-radius: 0; white-space: pre-wrap; word-break: break-all; }
  .cmd-pre code { background: none; padding: 0; font-size: inherit; }

  /* Tabs */
  .tabs-wrap { margin: 25px 0; border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
  .tabs-nav { display: flex; background: var(--bg); border-bottom: 1px solid var(--border); overflow-x: auto; }
  .tab-btn { padding: 11px 20px; background: transparent; border: none; border-bottom: 2px solid transparent; cursor: pointer; font-size: calc(0.9rem * var(--font-scale)); font-weight: 600; color: var(--text-2); white-space: nowrap; transition: 0.15s; font-family: inherit; margin-bottom: -1px; }
  .tab-btn.active { color: var(--brand); border-bottom-color: var(--brand); background: white; }
  .tab-btn:hover:not(.active) { color: var(--text); background: rgba(0,0,0,0.03); }
  .tab-panel { display: none; padding: 24px; background: var(--card-bg, #fff); }
  .tab-panel.active { display: block; }
  .tab-panel p { margin-bottom: 0.8rem; }

  /* FAQ Accordion */
  .faq-list { display: flex; flex-direction: column; gap: 8px; margin: 25px 0; }
  .faq-item { background: var(--card-bg, #fff); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; transition: border-color 0.15s; }
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
  .prompt-box { background: #0F172A; border-radius: var(--radius); overflow: hidden; margin: 20px 0; }
  .prompt-label { padding: 9px 16px; background: var(--brand); color: white; font-size: calc(0.82rem * var(--font-scale)); font-weight: 700; letter-spacing: 0.03em; }
  .prompt-content { display: block; margin: 0; padding: 18px 20px; color: #CBD5E1; font-family: var(--font-code); font-size: calc(0.88rem * var(--font-scale)); white-space: pre-wrap; line-height: 1.9; background: transparent; border-radius: 0; }

  /* Stat Highlight */
  .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; margin: 25px 0; }
  .stat-card { background: var(--card-bg, #fff); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px 16px; text-align: center; box-shadow: var(--shadow); transition: 0.2s; }
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

  /* 비교표(Table) 세로형 가이드 스타일 고도화 */
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
  .part-banner-header { display: flex; align-items: center; border-radius: var(--radius); overflow: hidden; margin-bottom: 0; box-shadow: var(--shadow); }
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

  .summary-bar { margin-top: 40px; padding: 24px; background: var(--text); border-radius: var(--radius); display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 20px; box-shadow: var(--shadow); }
  .summary-item { display: flex; flex-direction: column; gap: 4px; }
  .summary-num { font-family: var(--font-code); font-size: calc(28px * var(--font-scale)); font-weight: 700; color: var(--bg); line-height: 1; }
  .summary-num .unit { font-size: calc(12px * var(--font-scale)); font-weight: 300; color: rgba(255,255,255,0.6); margin-left: 2px; }
  .summary-label { font-size: calc(11px * var(--font-scale)); color: rgba(255,255,255,0.4); letter-spacing: 0.1em; text-transform: uppercase; font-weight: 500; }

  /* ── [NEW] level-grid, checkpoint-grid, step-flow, takeaway-banner 스타일 ── */
  .level-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin: 25px 0; }
  .level-card { background: var(--card-bg, #fff); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; text-align: center; box-shadow: var(--shadow); transition: all 0.2s ease; display: flex; flex-direction: column; justify-content: space-between; }
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
  .checkpoint-item { display: flex; align-items: center; gap: 16px; background: var(--card-bg, #fff); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px; box-shadow: var(--shadow); transition: all 0.2s ease; }
  .checkpoint-item:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
  .ci-icon { font-size: calc(1.6rem * var(--font-scale)); display: flex; align-items: center; justify-content: center; flex-shrink: 0; width: 42px; height: 42px; background: var(--brand-light); border-radius: 50%; color: var(--brand); }
  .ci-text { font-size: var(--size-card-p); color: var(--text); line-height: 1.4; text-align: left; }
  .ci-text strong { font-size: var(--size-card-title); font-weight: 700; color: var(--brand-dark); }

  .step-flow { display: flex; align-items: stretch; gap: 15px; margin: 25px 0; overflow-x: auto; padding-bottom: 10px; }
  .step-flow-step { flex: 1; min-width: 140px; background: var(--card-bg, #fff); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; text-align: center; position: relative; display: flex; flex-direction: column; align-items: center; box-shadow: var(--shadow); }
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
