import { Settings, RotateCcw, Plus } from 'lucide-react';

interface ThemeFormShape {
  label: string;
  brand: string;
  brandDark: string;
  brandDeep: string;
  brandLight: string;
  brandMid: string;
  border: string;
  bg: string;
  [key: string]: any;
}

interface PaletteBuilderFormProps {
  themeForm: ThemeFormShape;
  newCustomThemeId: string;
  onFormChange: (key: string, val: string) => void;
  onNewCustomThemeIdChange: (val: string) => void;
  onReset: () => void;
  onRegister: () => void;
}

const FIELDS: Array<{ key: keyof ThemeFormShape; label: string }> = [
  { key: 'brand', label: '메인 주컬러 (Brand)' },
  { key: 'brandDark', label: '서브 어두운톤 (Dark)' },
  { key: 'brandDeep', label: '강조 깊은톤 (Deep)' },
  { key: 'brandLight', label: '강조 연한배경 (Light)' },
  { key: 'bg', label: '기본 배경색 (Bg)' },
  { key: 'border', label: '경계 테두리선 (Border)' },
];

// SubUtilities 섹션 2-B: 메인·서브·강조색 직접 조합 조율 폼
export default function PaletteBuilderForm({
  themeForm,
  newCustomThemeId,
  onFormChange,
  onNewCustomThemeIdChange,
  onReset,
  onRegister,
}: PaletteBuilderFormProps) {
  return (
    <>
      <div className="border-t border-slate-200 pt-3.5 space-y-3">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Settings className="h-3.5 w-3.5 text-blue-600" /> B. 메인·서브·강조색 직접 조합 조율
        </label>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-4 text-xs">
          <div className="space-y-1">
            <label className="text-slate-500 text-xs font-bold block">테마 한글 명칭</label>
            <input
              type="text"
              value={themeForm.label}
              onChange={(e) => onFormChange('label', e.target.value)}
              className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-slate-800 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            {FIELDS.map(({ key, label }) => (
              <div className="space-y-1" key={key}>
                <label className="text-slate-500 text-xs font-bold block">{label}</label>
                <div className="flex gap-1.5">
                  <input
                    type="color"
                    value={themeForm[key]}
                    onChange={(e) => onFormChange(key, e.target.value)}
                    className="w-6 h-6 p-0.5 bg-transparent border border-slate-200 rounded cursor-pointer shrink-0"
                  />
                  <input
                    type="text"
                    value={themeForm[key]}
                    onChange={(e) => onFormChange(key, e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-800 font-mono text-center uppercase"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-1.5 pt-1.5 border-t border-slate-200">
            <button
              onClick={onReset}
              className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-0.5 font-semibold"
            >
              <RotateCcw className="w-3 h-3" /> 초기화
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 pt-3.5 space-y-2 bg-slate-50 p-4 rounded-xl">
        <div className="text-xs font-bold text-slate-700">설정한 커스텀 테마를 디자인 시스템에 등록</div>
        <p className="text-xs text-slate-500 leading-normal">
          설정한 배색 조합 전체를 `styles.json`에 신규 영문 ID 테마로 추가합니다. 등록 후 마크다운 frontmatter에 적어 직접 컴파일할 수 있습니다.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={newCustomThemeId}
            onChange={(e) => onNewCustomThemeIdChange(e.target.value)}
            placeholder="예: custom-navy-group"
            className="bg-white border border-slate-400 rounded px-2.5 py-1.5 text-xs font-mono text-slate-800 flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={onRegister}
            className="bg-blue-600 hover:bg-blue-600 text-white font-semibold px-3 py-1.5 rounded text-xs flex items-center gap-1 transition-all shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" /> 시스템 등록
          </button>
        </div>
      </div>
    </>
  );
}
