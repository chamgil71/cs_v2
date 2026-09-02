interface Rating {
  color: string;
  rating: string;
  desc: string;
}

interface ContrastPreviewCardsProps {
  inspectColor: string;
  contrastWithWhite: number;
  contrastWithBlack: number;
  ratingWhite: Rating;
  ratingBlack: Rating;
}

// 배경 대비도 실시간 가시적 판별 프리뷰 3종 카드 (White BG / Black BG / Color Block BG)
export default function ContrastPreviewCards({
  inspectColor,
  contrastWithWhite,
  contrastWithBlack,
  ratingWhite,
  ratingBlack,
}: ContrastPreviewCardsProps) {
  return (
    <div className="md:col-span-7 space-y-3">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">배경 대비도 실시간 가시적 판별 프리뷰</label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="border border-slate-200 rounded-lg p-3 bg-white flex flex-col justify-between h-[150px] shadow-sm">
          <div>
            <span className="text-xs uppercase font-bold text-slate-400 block border-b border-slate-100 pb-1 mb-1.5">White BG</span>
            <div style={{ color: inspectColor }} className="text-sm font-bold leading-tight">제목 가독성 테스트</div>
            <p style={{ color: inspectColor }} className="text-xs leading-relaxed mt-1 font-medium">
              본문 크기 텍스트입니다. 흰색 배경 위에 글자가 출력됩니다.
            </p>
          </div>
          <span className={`text-xs font-bold ${ratingWhite.color} mt-2 block text-right`}>
            대비 {contrastWithWhite.toFixed(1)}:1 ({contrastWithWhite >= 4.5 ? 'AA통과' : '부적합'})
          </span>
        </div>

        <div className="border border-slate-800 rounded-lg p-3 bg-black flex flex-col justify-between h-[150px] shadow-sm text-white">
          <div>
            <span className="text-xs uppercase font-bold text-slate-600 block border-b border-slate-900 pb-1 mb-1.5">Black BG</span>
            <div style={{ color: inspectColor }} className="text-sm font-bold leading-tight">제목 가독성 테스트</div>
            <p style={{ color: inspectColor }} className="text-xs leading-relaxed mt-1 font-medium">
              본문 크기 텍스트입니다. 검은색 배경 위에 글자가 출력됩니다.
            </p>
          </div>
          <span className={`text-xs font-bold ${ratingBlack.color} mt-2 block text-right`}>
            대비 {contrastWithBlack.toFixed(1)}:1 ({contrastWithBlack >= 4.5 ? 'AA통과' : '부적합'})
          </span>
        </div>

        <div style={{ backgroundColor: inspectColor }} className="border border-slate-200 rounded-lg p-3 flex flex-col justify-between h-[150px] shadow-sm">
          <div>
            <span className="text-xs uppercase font-bold text-white/50 block border-b border-white/20 pb-1 mb-1.5">Color Block BG</span>
            <div className="space-y-2">
              <div className="text-sm font-extrabold text-white">White Text (대비 {contrastWithWhite.toFixed(1)}:1)</div>
              <div className="text-sm font-extrabold text-black">Black Text (대비 {contrastWithBlack.toFixed(1)}:1)</div>
            </div>
          </div>
          <span className="text-xs text-white/80 font-bold leading-none text-right">
            배경 위에 어울리는 글자색을 골라 쓰세요.
          </span>
        </div>
      </div>
    </div>
  );
}
