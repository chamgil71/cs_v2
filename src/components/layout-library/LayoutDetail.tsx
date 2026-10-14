import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { groupLabel, implSummary, pptgenSummary, snippetOf, type LayoutEntry } from '../../lib/layout-library';

type Props = { entry: LayoutEntry; args: string };

/** 배치 설명 — 구현 상태(cs_v2 HTML·PPTX / pptgen), 항목 칸, 배치 인수, 스니펫(복사) */
export default function LayoutDetail({ entry: e, args }: Props) {
  const [copied, setCopied] = useState(false);
  const s = implSummary(e);
  const snippet = snippetOf(e, args);
  const copy = () => navigator.clipboard?.writeText(snippet).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  const argRows = Object.entries(e.args);
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 text-xs">
      <div>
        <div className="text-[11px] text-blue-600 font-bold">{groupLabel(e.group)} · <code>{e.group}</code></div>
        <h3 className="text-base font-bold text-slate-800"><code>{e.name}</code></h3>
        <p className="text-slate-500">{e.label}</p>
      </div>
      <dl className="grid grid-cols-[88px_1fr] gap-y-1 gap-x-2">
        <dt className="text-slate-400">cs_v2 HTML</dt><dd className="text-slate-700">{s.html}</dd>
        <dt className="text-slate-400">cs_v2 PPTX</dt><dd className="text-slate-700">{s.pptx}</dd>
        <dt className="text-slate-400">pptgen PPTX</dt><dd className="text-slate-700">{pptgenSummary(e)}</dd>
        {e.aliases.length > 0 && (<><dt className="text-slate-400">옛 이름</dt><dd className="text-slate-500">{e.aliases.join(' · ')} <span className="text-slate-400">(읽기 호환 — 새 문서에 쓰지 않음)</span></dd></>)}
      </dl>
      <div>
        <div className="font-bold text-slate-700 mb-1">항목 칸</div>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(e.fields).map(([k, v]) => <span key={k} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600"><code className="font-bold">{k}</code> {v}</span>)}
        </div>
      </div>
      {argRows.length > 0 && (
        <div>
          <div className="font-bold text-slate-700 mb-1">배치 인수</div>
          <table className="w-full border-collapse">
            <thead><tr className="text-slate-400 text-left"><th className="py-1 pr-2">인수</th><th className="pr-2">값</th><th className="pr-2">기본</th><th className="pr-2">cs_v2</th><th>pptgen</th></tr></thead>
            <tbody>
              {argRows.map(([k, a]) => (
                <tr key={k} className="border-t border-slate-100 align-top" title={a.note}>
                  <td className="py-1 pr-2"><code className="font-bold">{k}</code></td>
                  <td className="pr-2 text-slate-600">{a.values}</td>
                  <td className="pr-2 text-slate-600">{a.default || '—'}</td>
                  <td className="pr-2">{a.cs_v2 ? '✓' : '—'}</td>
                  <td>{a.pptgen ? '✓' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="font-bold text-slate-700">스니펫 (카탈로그 예시 — pptgen 견본과 같음)</span>
          <button onClick={copy} className="flex items-center gap-1 text-blue-600 font-bold hover:underline">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}{copied ? '복사됨' : '복사'}
          </button>
        </div>
        <pre className="bg-slate-900 text-slate-100 rounded-lg p-3 overflow-x-auto text-[11px] leading-relaxed" data-testid="layout-snippet">{snippet}</pre>
      </div>
    </div>
  );
}
