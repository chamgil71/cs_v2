import { Palette, Save, Trash2, Plus, RefreshCw } from 'lucide-react';
import type { ThemeDetails } from '@/hooks/useThemeEditor';

interface ThemePresetPanelProps {
  styles: Record<string, ThemeDetails>;
  selectedStyle: string;
  loading: boolean;
  hasServer: boolean | null;
  newThemeKey: string;
  onNewThemeKeyChange: (val: string) => void;
  onSelectStyle: (key: string) => void;
  onDeleteTheme: (key: string) => void;
  onRefresh: () => void;
  onAddNewTheme: () => void;
  onSaveToServer: () => void;
}

// VisualAdjuster 좌측 패널: 테마 프리셋 목록 선택/삭제/신규 추가/서버 저장
export default function ThemePresetPanel({
  styles,
  selectedStyle,
  loading,
  hasServer,
  newThemeKey,
  onNewThemeKeyChange,
  onSelectStyle,
  onDeleteTheme,
  onRefresh,
  onAddNewTheme,
  onSaveToServer,
}: ThemePresetPanelProps) {
  return (
    <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <Palette className="h-4 w-4 text-blue-600" /> 디자인 테마 프리셋
        </h3>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="text-slate-500 hover:text-slate-700"
          title="새로고침"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
        {Object.entries(styles).map(([key, value]) => (
          <div
            key={key}
            onClick={() => onSelectStyle(key)}
            className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
              selectedStyle === key
                ? 'bg-blue-600/10 border-blue-500 text-blue-700 font-semibold'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-350 hover:text-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border border-slate-300 shrink-0"
                style={{ backgroundColor: value.brand || '#ccc' }}
              />
              <div>
                <div className="text-xs font-bold">{value.label || key}</div>
                <div className="text-xs text-slate-500 font-mono">{key}</div>
              </div>
            </div>
            {key !== 'custom-blue' && key !== 'ai-chat' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTheme(key);
                }}
                className="text-slate-400 hover:text-red-500 p-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 pt-3 space-y-2">
        <div className="text-xs font-semibold text-slate-500">새 테마 추가</div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="theme-id-name"
            value={newThemeKey}
            onChange={(e) => onNewThemeKeyChange(e.target.value)}
            className="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-850 font-mono flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={onAddNewTheme}
            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded text-xs flex items-center gap-1 transition-colors font-semibold"
          >
            <Plus className="h-3 w-3" /> 추가
          </button>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-3 flex gap-2">
        <button
          onClick={onSaveToServer}
          disabled={hasServer === false}
          title={hasServer === false ? "로컬 개발 서버(npm run dev) 연결 시에만 사용 가능합니다" : undefined}
          className="flex-1 bg-blue-600 hover:bg-blue-550 text-white font-semibold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Save className="h-3.5 w-3.5" />
          {hasServer === false ? "서버 미연결 (저장 불가)" : "서버에 최종 저장하기"}
        </button>
      </div>
    </div>
  );
}
