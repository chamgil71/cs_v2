/**
 * shortcode-ext/native.mjs — 기존 숏코드(구현 ID)가 새로 받는 배치 인수의 CSS (2026-10-14, 인계서 C1).
 * 마크업은 shortcode-render.mjs 의 각 분기(인수가 기본값이면 예전 마크업 그대로), 모양은 여기 한 곳.
 *   process.track connector=line(.sf-line) · emphasis(.wf-step.active) / data.stats emphasis(.stat-card.sx-emph)
 *   process.levels grow(.lv-grow + --lv-k) / process.branch connector=arrow(.gf-arrow)
 */
export const css = `
  .step-flow.sf-line { gap: 30px; }
  .step-flow.sf-line .step-flow-step:not(:last-child)::after { content: ""; position: absolute; top: 50%; right: -31px; width: 32px; border-top: 2px solid var(--brand-light); }
  .wf-step.active { border-color: var(--brand); box-shadow: var(--shadow-lg, var(--card-shadow, var(--shadow))); }
  .wf-step.active .wf-icon { background: var(--brand); color: #fff; }
  .stat-card.sx-emph { background: color-mix(in srgb, var(--brand) 9%, var(--set-card-bg, var(--card-bg, #fff))); box-shadow: var(--shadow-lg, var(--card-shadow, var(--shadow))); }
  .level-grid.lv-grow { align-items: end; }
  .level-grid.lv-grow .level-card { min-height: calc(var(--lv-h, clamp(150px, 30vh, 280px)) * var(--lv-k, 1)); }
  .commit-line-segment.gf-arrow { position: relative; }
  .commit-line-segment.gf-arrow::after { content: ""; position: absolute; right: -2px; top: 50%; transform: translateY(-50%); border-left: 9px solid currentColor; border-top: 6px solid transparent; border-bottom: 6px solid transparent; }
`;
