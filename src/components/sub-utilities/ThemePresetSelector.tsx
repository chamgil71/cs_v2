interface PresetTheme {
  id: string;
  label: string;
  brand: string;
  brandDark: string;
  brandLight: string;
  border: string;
  [key: string]: any;
}

interface ThemePresetSelectorProps {
  presetThemes: PresetTheme[];
  onApplyPreset: (preset: PresetTheme) => void;
}

// SubUtilities 섹션 2-A: 추천 디자이너 프리셋 그리드
export default function ThemePresetSelector({ presetThemes, onApplyPreset }: ThemePresetSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">A. 추천 디자이너 프리셋 불러오기</label>
      <div className="grid grid-cols-2 gap-2">
        {presetThemes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onApplyPreset(theme)}
            className="p-2.5 bg-white border border-slate-200 rounded-lg hover:border-blue-500 text-left transition-all shadow-sm space-y-1"
          >
            <span className="text-xs font-extrabold text-slate-700 block truncate">{theme.label}</span>
            <div className="flex gap-0.5">
              <span className="w-3 h-3 rounded-full border border-slate-100" style={{ backgroundColor: theme.brand }} />
              <span className="w-3 h-3 rounded-full border border-slate-100" style={{ backgroundColor: theme.brandDark }} />
              <span className="w-3 h-3 rounded-full border border-slate-100" style={{ backgroundColor: theme.brandLight }} />
              <span className="w-3 h-3 rounded-full border border-slate-100" style={{ backgroundColor: theme.border }} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
