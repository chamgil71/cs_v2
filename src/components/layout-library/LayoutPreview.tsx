import { useEffect, useMemo, useRef, useState, type SyntheticEvent } from 'react';
import { clientCompileMarkdown, BUNDLED_STYLES } from '../../lib/client-compiler';
import { previewMd, exampleVariants, SHAPE_SET_NAMES, shapeSetLabel, type LayoutEntry } from '../../lib/layout-library';

type Props = {
  entry: LayoutEntry; args: string; style: string; shape: string; mode: 'html' | 'presentation';
  onArgs: (a: string) => void; onStyle: (s: string) => void; onShape: (s: string) => void; onMode: (m: 'html' | 'presentation') => void;
};

/** 실시간 미리보기 — 카탈로그 예시를 서버 CLI 와 같은 코어(clientCompileMarkdown)로 그린다. 테마·서식 세트·인수 변형을 바꿔 본다 */
export default function LayoutPreview({ entry, args, style, shape, mode, onArgs, onStyle, onShape, onMode }: Props) {
  const html = useMemo(() => {
    try { return clientCompileMarkdown(previewMd(entry, args, style, shape), mode, style, BUNDLED_STYLES); }
    catch (err) { return `<pre style="color:#b91c1c;padding:16px">미리보기 실패: ${String(err).replace(/</g, '&lt;')}</pre>`; }
  }, [entry, args, style, shape, mode]);
  // 코어는 표지(머리말 title)를 늘 먼저 그린다 — 미리보기는 배치가 있는 곳으로 바로 이동(슬라이드: 2장째, 가이드: 첫 절).
  // scrollIntoView 는 바깥 페이지까지 굴리므로 iframe 안의 스크롤 위치만 바꾼다.
  const jump = (ev: SyntheticEvent<HTMLIFrameElement>) => {
    const d = ev.currentTarget.contentDocument, w = ev.currentTarget.contentWindow;
    if (!d || !w) return;
    const slide = d.querySelectorAll<HTMLElement>('.slide')[1], deck = d.getElementById('slides');
    if (mode === 'presentation' && slide && deck) { deck.style.scrollBehavior = 'auto'; deck.scrollLeft = slide.offsetLeft; deck.dispatchEvent(new Event('scroll')); return; }
    const sec = d.querySelector<HTMLElement>('.section');
    if (sec) w.scrollTo(0, sec.getBoundingClientRect().top + w.scrollY - 70);
  };
  // 가상 화면 크기(슬라이드 1280×720, 가이드 1200 폭)를 칸 너비에 맞춰 축소 — 편집기 미리보기(MarkdownCompiler)와 같은 방식
  const wrap = useRef<HTMLDivElement>(null);
  const [boxW, setBoxW] = useState(800);
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([en]) => setBoxW(en.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const VW = mode === 'presentation' ? 1280 : 1200, scale = Math.min(1, boxW / VW);
  const VH = mode === 'presentation' ? 720 : Math.round(460 / scale);
  const sel = 'text-xs border border-slate-200 rounded-md px-2 py-1 bg-white';
  const variants = exampleVariants(entry);
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <select aria-label="테마" className={sel} value={style} onChange={(ev) => onStyle(ev.target.value)}>
          {Object.entries(BUNDLED_STYLES).map(([k, v]: [string, any]) => <option key={k} value={k}>{v?.label || k}</option>)}
        </select>
        <select aria-label="서식 세트" className={sel} value={shape} onChange={(ev) => onShape(ev.target.value)} title={shapeSetLabel(shape)}>
          {SHAPE_SET_NAMES.map((s) => <option key={s} value={s}>서식 {s}</option>)}
        </select>
        <div className="flex rounded-md border border-slate-200 overflow-hidden">
          {(['html', 'presentation'] as const).map((m) => (
            <button key={m} onClick={() => onMode(m)} className={`px-2.5 py-1 font-bold ${mode === m ? 'bg-slate-800 text-white' : 'bg-white text-slate-600'}`}>{m === 'html' ? '종형 가이드' : '횡형 슬라이드'}</button>
          ))}
        </div>
      </div>
      {variants.length > 1 && (
        <div className="flex flex-wrap gap-1.5 text-[11px]">
          <span className="text-slate-400 py-1">인수 변형</span>
          {variants.map((v) => (
            <button key={v || 'base'} onClick={() => onArgs(v)}
              className={`px-2 py-1 rounded border font-mono ${args === v ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 text-slate-600'}`}>{v || '기본 인수'}</button>
          ))}
        </div>
      )}
      <div ref={wrap} className={`relative rounded-lg border border-slate-200 overflow-hidden ${mode === 'presentation' ? 'aspect-video' : 'h-[460px]'}`}>
        <div style={{ width: VW, height: VH, transform: `scale(${scale})`, transformOrigin: 'top left', position: 'absolute', top: 0, left: 0 }}>
          <iframe title="배치 미리보기" data-testid="layout-preview" srcDoc={html} onLoad={jump} style={{ width: '100%', height: '100%', border: 'none', display: 'block' }} />
        </div>
      </div>
      <p className="text-[11px] text-slate-400">{shapeSetLabel(shape)}</p>
    </div>
  );
}
