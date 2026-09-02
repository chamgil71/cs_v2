import { Settings, Check } from 'lucide-react';
import type { ThemeDetails } from '@/hooks/useThemeEditor';

interface ColorFieldProps {
  label: string;
  field: keyof ThemeDetails;
  value: string;
  onChange: (field: keyof ThemeDetails, val: string) => void;
}

function ColorField({ label, field, value, onChange }: ColorFieldProps) {
  return (
    <div className="space-y-1">
      <label className="text-slate-500 font-semibold block">{label}</label>
      <div className="flex gap-1.5">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          className="w-7 h-7 p-0.5 bg-transparent border border-slate-200 rounded cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          className="bg-white border border-slate-200 rounded px-1.5 py-1 text-slate-800 font-mono text-center flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

interface ThemeEditorPanelProps {
  selectedStyle: string;
  themeForm: ThemeDetails;
  onFormChange: (field: keyof ThemeDetails, val: string) => void;
  onSaveEdit: () => void;
}

// VisualAdjuster 중앙 패널: 선택된 테마의 HSL 색상·폰트 세부 조율 폼
export default function ThemeEditorPanel({ selectedStyle, themeForm, onFormChange, onSaveEdit }: ThemeEditorPanelProps) {
  return (
    <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-850 flex items-center gap-1.5">
          <Settings className="h-4 w-4 text-blue-600" /> HSL 색상 및 폰트 세부 조율
        </h3>
        <p className="text-xs text-slate-500 mt-0.5 font-semibold">선택된 테마 프리셋의 세부 디자인 토큰 값을 미세 변경합니다.</p>
      </div>

      <div className="space-y-3 text-xs max-h-[380px] overflow-y-auto pr-1">
        <div className="space-y-1 bg-slate-50 border border-slate-100 rounded-lg p-2.5">
          <label className="text-xs text-slate-500 font-bold uppercase block">선택된 테마 영문 키 ID (style 지정용)</label>
          <span className="font-mono text-sm font-extrabold text-blue-700 select-all block mt-0.5">
            {selectedStyle}
          </span>
        </div>

        <div className="space-y-1">
          <label className="text-slate-500 font-semibold">테마 한글명</label>
          <input
            type="text"
            value={themeForm.label}
            onChange={(e) => onFormChange('label', e.target.value)}
            className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <ColorField label="브랜드 주컬러 (Brand)" field="brand" value={themeForm.brand} onChange={onFormChange} />
          <ColorField label="브랜드 어두운톤 (Dark)" field="brandDark" value={themeForm.brandDark} onChange={onFormChange} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ColorField label="브랜드 깊은톤 (Deep)" field="brandDeep" value={themeForm.brandDeep} onChange={onFormChange} />
          <ColorField label="브랜드 밝은톤 (Light)" field="brandLight" value={themeForm.brandLight} onChange={onFormChange} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <ColorField label="브랜드 중간톤 (Mid)" field="brandMid" value={themeForm.brandMid} onChange={onFormChange} />
          <ColorField label="테두리선 색 (Border)" field="border" value={themeForm.border} onChange={onFormChange} />
        </div>

        <ColorField label="연한 본문 배경색 (Bg)" field="bg" value={themeForm.bg} onChange={onFormChange} />

        <div className="space-y-3 pt-3 border-t border-slate-200">
          <div className="font-semibold text-slate-600">글꼴(Font) 패밀리 매핑</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-18 text-slate-500 text-xs shrink-0 font-medium">웹 타이틀:</span>
              <input
                type="text"
                value={themeForm.webFontTitle}
                onChange={(e) => onFormChange('webFontTitle', e.target.value)}
                className="bg-white border border-slate-200 rounded px-2.5 py-1 text-slate-850 flex-1 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-18 text-slate-500 text-xs shrink-0 font-medium">웹 본문:</span>
              <input
                type="text"
                value={themeForm.webFont}
                onChange={(e) => onFormChange('webFont', e.target.value)}
                className="bg-white border border-slate-200 rounded px-2.5 py-1 text-slate-855 flex-1 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="w-18 text-slate-500 text-xs shrink-0 font-medium">PPTX 서체:</span>
              <input
                type="text"
                value={themeForm.pptxFont}
                onChange={(e) => onFormChange('pptxFont', e.target.value)}
                className="bg-white border border-slate-200 rounded px-2.5 py-1 text-slate-855 flex-1 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onSaveEdit}
        className="w-full bg-blue-600 hover:bg-blue-600 text-white text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1 transition-colors shadow-sm"
      >
        <Check className="h-4 w-4" /> 현재 테마 설정에 임시 저장 (로컬)
      </button>
    </div>
  );
}
