/**
 * shortcode-styles/cards.mjs — 숏코드 CSS 부분: 카드·그리드·도구·흐름·단계·요금제·비교 2단·깃 플로우·에디터·네트워크.
 * shortcode-styles.mjs 의 SHORTCODE_CSS 가 순서대로 이어 붙인다(단일 출처는 그대로 — 바깥에서는 SHORTCODE_CSS 만 쓴다).
 */
export const CARDS_CSS = `
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
    background: var(--set-card-bg, var(--card-bg, #fff)); border: var(--card-border-width, 1px) solid var(--card-border-color, var(--border)); border-radius: var(--card-radius, var(--radius)); padding: 25px;
    position: relative; overflow: hidden; transition: 0.2s; box-shadow: var(--card-shadow, var(--shadow));
  }
  /* bg=alt 블록 — 서식 세트의 보조 카드색(--card-alt-bg, shape-set.mjs 가 :root 에 넣음). display:contents 라 배치에 영향 없음 */
  .sc-bg-alt { display: contents; --set-card-bg: var(--card-alt-bg); }
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
  .tool-card { border-radius: var(--card-radius, var(--radius)); overflow: hidden; border: var(--card-border-width, 1px) solid var(--card-border-color, var(--border)); box-shadow: var(--card-shadow, var(--shadow)); margin: 25px 0; }
  .tc-header { padding: 25px; display: flex; align-items: center; gap: 20px; }
  .tc-icon { width: 55px; height: 55px; border-radius: calc(var(--radius) / 2); background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; font-size: calc(1.8rem * var(--font-scale)); }
  .tc-content { flex: 1; min-width: 0; }
  .tc-name { font-size: calc(var(--size-card-title) * var(--font-scale)); font-weight: 800; }
  .tc-sub { font-size: calc(var(--size-card-p) * var(--font-scale)); opacity: 0.9; }
  .tc-badge { margin-left: auto; font-size: calc(0.8rem * var(--font-scale)); font-weight: 800; padding: 5px 15px; border-radius: 100px; background: rgba(255,255,255,0.25); }
  .tc-list { padding: 12px 25px 14px 40px; font-size: calc(var(--size-card-p) * var(--font-scale)); background: var(--bg); border-top: 1px solid var(--border); color: var(--text-2); margin: 0; line-height: 1.9; }

  /* Workflow */
  .workflow-flow { display: flex; gap: 15px; margin: 25px 0; overflow-x: auto; padding-bottom: 10px; }
  .wf-step { flex: 1; min-width: 140px; background: var(--set-card-bg, var(--card-bg, #fff)); border: var(--card-border-width, 1px) solid var(--card-border-color, var(--border)); border-radius: var(--card-radius, var(--radius)); padding: 20px; text-align: center; position: relative; }
  .wf-icon { width: 45px; height: 45px; margin: 0 auto 10px; background: var(--brand-light); color: var(--brand); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: calc(1.3rem * var(--font-scale)); }
  .wf-name { font-weight: 800; font-size: calc(var(--size-card-title) * var(--font-scale)); margin-bottom: 5px; }
  .wf-tool { font-size: calc(var(--size-card-p) * var(--font-scale)); color: var(--text-2); }
  .wf-arrow { position: absolute; right: -15px; top: 50%; transform: translateY(-50%); font-weight: 900; color: #cbd5e1; z-index: 1; font-size: calc(1.2rem * var(--font-scale)); }

  /* Steps */
  .step-list { display: flex; flex-direction: column; gap: 15px; margin: 25px 0; }
  .step-item { display: flex; gap: 20px; background: var(--set-card-bg, var(--card-bg, #fff)); border: var(--card-border-width, 1px) solid var(--card-border-color, var(--border)); border-radius: var(--card-radius, var(--radius)); padding: 20px; box-shadow: var(--card-shadow, var(--shadow)); }
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
  .skill-item { display: flex; align-items: center; gap: 20px; background: var(--set-card-bg, var(--card-bg, #fff)); border: var(--card-border-width, 1px) solid var(--card-border-color, var(--border)); border-radius: var(--card-radius, var(--radius)); padding: 15px 25px; }
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
  .c2-card { flex: 1; background: var(--set-card-bg, var(--card-bg, #fff)); border: var(--card-border-width, 1px) solid var(--card-border-color, var(--border)); border-radius: var(--card-radius, var(--radius)); padding: 30px; position: relative; overflow: hidden; box-shadow: var(--card-shadow, var(--shadow)); }
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
  .git-flow-container { background: #0F172A; padding: 28px; border-radius: var(--card-radius, var(--radius)); border: 1px solid rgba(255,255,255,0.08); margin: 25px 0; overflow-x: auto; }
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
  .editor-sim { background: #1E1E1E; border: 1px solid #333; border-radius: var(--card-radius, var(--radius)); overflow: hidden; box-shadow: var(--shadow-lg); margin: 25px 0; }
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
  .graph-visual { background: #0A0F1E; border-radius: var(--card-radius, var(--radius)); border: 1px solid rgba(255,255,255,0.06); height: 280px; position: relative; margin: 25px 0; overflow: hidden; }
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

`;
