import { useState, useEffect } from 'react';
import { Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getContrast, getWCAGRating } from '../../lib/wcag';
import ContrastPreviewCards from './ContrastPreviewCards';

// SubUtilities 섹션 1: 디자인 시스템 등록 색상 사전 + 수동 HEX 대비 검사기
export default function ContrastChecker() {
  const { toast } = useToast();

  const [dictionaryColors, setDictionaryColors] = useState<string[]>([]);
  const [inspectColor, setInspectColor] = useState('#2789F5');
  const [inspectColorInput, setInspectColorInput] = useState('#2789F5');

  const loadDictionaryColors = async () => {
    try {
      const res = await fetch('/api/list-styles');
      if (res.ok) {
        const styles = await res.json();
        const colors = new Set<string>();
        Object.values(styles).forEach((theme: any) => {
          if (theme.brand) colors.add(theme.brand.toUpperCase());
          if (theme.brandDark) colors.add(theme.brandDark.toUpperCase());
          if (theme.brandDeep) colors.add(theme.brandDeep.toUpperCase());
          if (theme.brandLight) colors.add(theme.brandLight.toUpperCase());
          if (theme.border) colors.add(theme.border.toUpperCase());
        });
        setDictionaryColors(Array.from(colors));
      }
    } catch (err) {
      console.error('Failed to load dictionary styles:', err);
    }
  };

  useEffect(() => {
    loadDictionaryColors();
  }, []);

  const contrastWithWhite = getContrast(inspectColor, '#FFFFFF');
  const contrastWithBlack = getContrast(inspectColor, '#000000');
  const ratingWhite = getWCAGRating(contrastWithWhite);
  const ratingBlack = getWCAGRating(contrastWithBlack);

  const handleInspectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let val = inspectColorInput.trim();
    if (!val.startsWith('#')) {
      val = '#' + val;
    }
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      setInspectColor(val.toUpperCase());
    } else {
      toast({
        title: '색상값 입력 오류',
        description: '올바른 HEX 코드(#FFFFFF 형태)를 입력해 주세요.',
        variant: 'destructive'
      });
    }
  };

  const handleColorChange = (hex: string) => {
    setInspectColor(hex.toUpperCase());
    setInspectColorInput(hex.toUpperCase());
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <Palette className="h-4 w-4 text-blue-600" /> 1. 개별 색상 사전 및 대비 검사기
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          디자인 시스템(`styles.json`)에 등록된 단색 칩을 클릭하거나 수동 입력하여 흰색/검은색 배경 대비를 가시적으로 비교하고 가독성을 판별합니다.
        </p>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">디자인 시스템 등록 색상 사전 (단색 칩 목록)</label>
        <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto p-1 bg-slate-50 border border-slate-100 rounded-lg">
          {dictionaryColors.map((color, i) => (
            <button
              key={i}
              onClick={() => handleColorChange(color)}
              className={`flex items-center gap-1.5 px-2 py-1 bg-white border rounded hover:border-blue-500 transition-all text-sm font-semibold ${
                inspectColor === color ? 'border-blue-600 ring-1 ring-blue-500' : 'border-slate-200'
              }`}
            >
              <span className="w-3.5 h-3.5 rounded border border-slate-200" style={{ backgroundColor: color }} />
              <span className="font-mono">{color}</span>
            </button>
          ))}
          {dictionaryColors.length === 0 && (
            <span className="text-xs text-slate-400 p-1">디자인 시스템에서 불러온 색상이 없습니다.</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
        <div className="md:col-span-5 space-y-4">
          <form onSubmit={handleInspectSubmit} className="space-y-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">수동 색상 검사 (HEX 입력)</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={inspectColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-10 h-10 p-0.5 border border-slate-200 rounded cursor-pointer bg-transparent"
              />
              <input
                type="text"
                value={inspectColorInput}
                onChange={(e) => setInspectColorInput(e.target.value)}
                placeholder="#2789F5"
                className="border border-slate-300 rounded px-3 py-2 text-sm flex-1 font-mono uppercase focus:outline-none focus:border-blue-500 text-slate-800"
              />
              <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded text-sm transition-colors shadow-sm">
                분석
              </button>
            </div>
          </form>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4 text-sm">
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-slate-500 font-medium">검사 대상 색상:</span>
              <strong className="font-mono text-slate-900 flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full border border-slate-400" style={{ backgroundColor: inspectColor }} />
                {inspectColor}
              </strong>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">흰색 배경 위 대비율:</span>
                <strong className={`font-mono text-sm ${ratingWhite.color}`}>
                  {contrastWithWhite.toFixed(2)} : 1
                </strong>
              </div>
              <div className="text-xs text-slate-600 font-semibold">
                판정: <span className={`font-bold ${ratingWhite.color}`}>{ratingWhite.rating}</span> — {ratingWhite.desc}
              </div>
            </div>
            <div className="space-y-1 pt-1.5 border-t border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">검정 배경 위 대비율:</span>
                <strong className={`font-mono text-sm ${ratingBlack.color}`}>
                  {contrastWithBlack.toFixed(2)} : 1
                </strong>
              </div>
              <div className="text-xs text-slate-600 font-semibold">
                판정: <span className={`font-bold ${ratingBlack.color}`}>{ratingBlack.rating}</span> — {ratingBlack.desc}
              </div>
            </div>
          </div>
        </div>

        <ContrastPreviewCards
          inspectColor={inspectColor}
          contrastWithWhite={contrastWithWhite}
          contrastWithBlack={contrastWithBlack}
          ratingWhite={ratingWhite}
          ratingBlack={ratingBlack}
        />
      </div>
    </div>
  );
}
