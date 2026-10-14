import { Search } from 'lucide-react';
import { LAYOUT_ENTRIES, GROUP_KEYS, groupLabel, implSummary, matches, type LayoutEntry } from '../../lib/layout-library';

type Props = { group: string; query: string; selected: string; onGroup: (g: string) => void; onQuery: (q: string) => void; onSelect: (name: string) => void };

/** 왼쪽 목록 — 그룹 버튼·검색(기능 이름·설명·옛 이름) + 배치 목록(cs_v2 구현 상태 표시) */
export default function LayoutList({ group, query, selected, onGroup, onQuery, onSelect }: Props) {
  const list: LayoutEntry[] = LAYOUT_ENTRIES.filter((e) => (!group || e.group === group) && matches(e, query));
  const pill = (g: string, label: string, n: number) => (
    <button key={g || 'all'} onClick={() => onGroup(g)}
      className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${group === g ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}>
      {label} <span className="opacity-70">{n}</span>
    </button>
  );
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-3 min-h-0">
      <div className="relative">
        <Search className="h-4 w-4 text-slate-400 absolute left-2.5 top-2.5" />
        <input value={query} onChange={(ev) => onQuery(ev.target.value)} placeholder="기능 이름·설명·옛 이름 검색"
          className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400" />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {pill('', '전체', LAYOUT_ENTRIES.length)}
        {GROUP_KEYS.map((g) => pill(g, groupLabel(g), LAYOUT_ENTRIES.filter((e) => e.group === g).length))}
      </div>
      <ul className="overflow-y-auto max-h-[560px] divide-y divide-slate-100 -mx-1" data-testid="layout-list">
        {list.map((e) => {
          const s = implSummary(e);
          return (
            <li key={e.name}>
              <button onClick={() => onSelect(e.name)}
                className={`w-full text-left px-2 py-2 rounded-md transition-colors ${selected === e.name ? 'bg-blue-50' : 'hover:bg-slate-50'}`}>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-xs font-bold text-slate-800">{e.name}</code>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${s.direct ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{s.direct ? '직접' : '근사'}</span>
                </div>
                <div className="text-[11px] text-slate-500 truncate">{e.label}</div>
              </button>
            </li>
          );
        })}
        {!list.length && <li className="text-xs text-slate-400 p-3">맞는 배치가 없습니다.</li>}
      </ul>
    </div>
  );
}
