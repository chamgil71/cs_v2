import { BookOpen } from 'lucide-react';

interface ThemeFormShape {
  label: string;
  brand: string;
  brandDark: string;
  brandDeep: string;
  brandLight: string;
  brandMid: string;
  border: string;
  bg: string;
  webFont: string;
  webFontTitle: string;
}

interface PaletteLivePreviewProps {
  themeForm: ThemeFormShape;
  newCustomThemeId: string;
}

// SubUtilities 섹션 2-C: 커스텀 조합 배색 구조 실시간 미리보기 (Interactive Mock View)
export default function PaletteLivePreview({ themeForm, newCustomThemeId }: PaletteLivePreviewProps) {
  return (
    <div className="lg:col-span-7 space-y-3">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
        <BookOpen className="h-3.5 w-3.5 text-emerald-500" /> 커스텀 조합 배색 구조 실시간 미리보기 (Interactive Mock View)
      </label>

      <div
        className="border rounded-xl p-6 space-y-4 shadow-sm transition-all duration-300 min-h-[350px] flex flex-col justify-between"
        style={{
          backgroundColor: themeForm.bg,
          borderColor: themeForm.border,
          fontFamily: themeForm.webFont
        }}
      >
        <div
          className="flex items-center justify-between p-3 rounded-lg border text-white"
          style={{ backgroundColor: themeForm.brand, borderColor: themeForm.brandDark }}
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
            <strong className="text-xs font-extrabold tracking-tight" style={{ fontFamily: themeForm.webFontTitle }}>
              가이드북 헤더 (Brand / Dark 매칭)
            </strong>
          </div>
          <span className="text-xs bg-white/20 border border-white/30 px-2 py-0.5 rounded-full font-bold">
            ID: {newCustomThemeId}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 my-2">
          <div
            className="p-4 border rounded-xl space-y-2 bg-white/90 shadow-sm"
            style={{ borderColor: themeForm.border }}
          >
            <strong className="text-xs font-extrabold block" style={{ color: themeForm.brandDark, fontFamily: themeForm.webFontTitle }}>
              컨텐츠 카드 타이틀
            </strong>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              설정한 메인(Brand), 서브(Dark), 경계선(Border) 등의 변수 조합이 실시간 반영된 모형입니다.
            </p>
            <div
              className="text-xs px-2.5 py-1 rounded inline-block text-white font-bold cursor-pointer hover:opacity-90 shadow-sm transition-opacity"
              style={{ backgroundColor: themeForm.brandDeep }}
            >
              강조 액션 (Deep)
            </div>
          </div>

          <div
            className="p-4 border rounded-xl space-y-3 flex flex-col justify-between shadow-sm"
            style={{ backgroundColor: themeForm.brandLight, borderColor: themeForm.border }}
          >
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider block" style={{ color: themeForm.brandDark }}>
                Light & Mid 배색 대조
              </span>
              <p className="text-xs text-slate-700 leading-normal mt-0.5 font-semibold">
                연한 배경(Light) 위에서의 텍스트식별을 검증합니다.
              </p>
            </div>
            <div
              className="text-xs p-1.5 rounded border text-center font-bold"
              style={{ backgroundColor: themeForm.brandMid, borderColor: themeForm.border, color: themeForm.brandDeep }}
            >
              중간톤 블록 (Mid Color)
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs text-slate-400 border-t pt-2.5" style={{ borderColor: themeForm.border }}>
          <span className="font-semibold">© Creative Spark V2.0 Custom Theme Builder</span>
          <span className="font-mono text-[10px]">{themeForm.brand} / {themeForm.brandDeep}</span>
        </div>
      </div>
    </div>
  );
}
