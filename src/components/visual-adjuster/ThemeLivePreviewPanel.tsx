import { BookOpen } from 'lucide-react';
import type { ThemeDetails } from '@/hooks/useThemeEditor';
import { getContrast, getWCAGRating } from '../../lib/wcag';

interface ThemeLivePreviewPanelProps {
  themeForm: ThemeDetails;
  selectedStyle: string;
}

// VisualAdjuster 우측 패널: 실시간 컴포넌트 미리보기 + WCAG 명도 대비 판정
export default function ThemeLivePreviewPanel({ themeForm, selectedStyle }: ThemeLivePreviewPanelProps) {
  const contrastWithWhite = getContrast(themeForm.brand || '#2563FF', '#FFFFFF');
  const contrastWithBlack = getContrast(themeForm.brand || '#2563FF', '#000000');
  const ratingWhite = getWCAGRating(contrastWithWhite);
  const ratingBlack = getWCAGRating(contrastWithBlack);

  return (
    <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <BookOpen className="h-4 w-4 text-emerald-600" /> 실시간 컴포넌트 프리뷰
        </h3>
        <p className="text-xs text-slate-500 mt-0.5 font-semibold">수정된 테마 색상이 시각 컴포넌트에 즉시 적용되어 표시됩니다.</p>
      </div>

      <div className="my-6 space-y-4 bg-slate-50 border border-slate-200 p-4 rounded-xl flex-1 flex flex-col justify-center min-h-[300px]">
        <div
          className="border rounded-xl p-4 space-y-2 shadow-sm transition-all duration-300"
          style={{
            backgroundColor: themeForm.bg || '#F8F9FE',
            borderColor: themeForm.border || '#D8DCFB',
            fontFamily: themeForm.webFont || 'sans-serif'
          }}
        >
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: themeForm.brand || '#2563FF' }}
            />
            <strong
              className="text-xs font-bold"
              style={{ color: themeForm.brandDark || '#1E71CE', fontFamily: themeForm.webFontTitle }}
            >
              가이드 헤더 컴포넌트
            </strong>
          </div>
          <p className="text-xs text-slate-700 font-medium">
            V2 스타일 조율기가 실시간 변수 바인딩을 통제하고 있습니다.
          </p>
          <div
            className="text-xs px-2 py-1 rounded border inline-block text-white font-bold"
            style={{ backgroundColor: themeForm.brand || '#2563FF', borderColor: themeForm.brandDark }}
          >
            확인 버튼
          </div>
        </div>

        <div
          className="border-l-4 rounded-r-lg p-3 space-y-1 transition-all duration-300"
          style={{
            backgroundColor: themeForm.brandLight || '#F0F7FF',
            borderLeftColor: themeForm.brand || '#2563FF',
            fontFamily: themeForm.webFont || 'sans-serif'
          }}
        >
          <div
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: themeForm.brandDark || '#1E71CE' }}
          >
            Tip Alert Box
          </div>
          <p className="text-xs text-slate-700 leading-normal">
            테마 색상이 변경되는 즉시 CSS 커스텀 속성에 동적 반영됩니다.
          </p>
        </div>

        <div className="flex gap-1 h-3 rounded-full overflow-hidden border border-slate-200">
          <div className="flex-1" style={{ backgroundColor: themeForm.brand }} title="Brand" />
          <div className="flex-1" style={{ backgroundColor: themeForm.brandDark }} title="Dark" />
          <div className="flex-1" style={{ backgroundColor: themeForm.brandDeep }} title="Deep" />
          <div className="flex-1" style={{ backgroundColor: themeForm.brandMid }} title="Mid" />
          <div className="flex-1" style={{ backgroundColor: themeForm.brandLight }} title="Light" />
        </div>

        <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2.5">
          <div className="text-xs uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            WCAG 명도 가독성 실시간 판정
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-xs font-semibold text-slate-800">
            <div className="bg-white border border-slate-200 p-2 rounded shadow-sm flex flex-col justify-between h-[80px]">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block">White BG</span>
              <span style={{ color: themeForm.brand }} className="font-extrabold truncate">가독성 검증</span>
              <span className={`text-xs font-bold ${ratingWhite.color} text-right mt-1`}>
                {contrastWithWhite.toFixed(1)}:1 ({contrastWithWhite >= 4.5 ? 'AA통과' : '부적합'})
              </span>
            </div>

            <div className="bg-black border border-slate-800 p-2 rounded shadow-sm text-white flex flex-col justify-between h-[80px]">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Black BG</span>
              <span style={{ color: themeForm.brand }} className="font-extrabold truncate">가독성 검증</span>
              <span className={`text-xs font-bold ${ratingBlack.color} text-right mt-1`}>
                {contrastWithBlack.toFixed(1)}:1 ({contrastWithBlack >= 4.5 ? 'AA통과' : '부적합'})
              </span>
            </div>

            <div style={{ backgroundColor: themeForm.brand }} className="border border-slate-200 p-2 rounded shadow-sm flex flex-col justify-between h-[80px] text-white">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block">Color BG</span>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="text-[10px] font-extrabold text-white">White Text</span>
                <span className="text-[10px] font-extrabold text-black">Black Text</span>
              </div>
              <span className="text-[9px] text-white/70 text-right mt-1">대조군 대조</span>
            </div>
          </div>
          <div className="text-xs text-slate-500 leading-normal border-t border-slate-200 pt-1.5 space-y-0.5">
            <div>• 흰색 대비: <span className={`font-bold ${ratingWhite.color}`}>{ratingWhite.rating}</span> — {ratingWhite.desc}</div>
            <div>• 검정 대비: <span className={`font-bold ${ratingBlack.color}`}>{ratingBlack.rating}</span> — {ratingBlack.desc}</div>
          </div>
        </div>
      </div>

      <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-200 text-center leading-relaxed font-semibold">
        저장된 테마는 마크다운 컴파일러(Module A) 및 슬라이드 HTML 변환기에서 <code>style: {selectedStyle}</code> 옵션 지정 시 즉시 빌드에 투입됩니다.
      </div>
    </div>
  );
}
