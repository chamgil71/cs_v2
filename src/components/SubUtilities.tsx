import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { 
  Palette, 
  Upload, 
  Download, 
  RefreshCw, 
  FileCheck, 
  Info, 
  CheckCircle, 
  Plus, 
  BookOpen, 
  HelpCircle, 
  Sparkles,
  Settings,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { getContrast, getWCAGRating } from '../lib/wcag';

// Predefined Themes based on styles.json & original designs
const FALLBACK_PRESET_THEMES = [
  {
    id: 'theme-custom-blue',
    label: '페이퍼로지 오리지널 (블루)',
    brand: '#2789F5',
    brandDark: '#1E71CE',
    brandDeep: '#0F478F',
    brandLight: '#F0F7FF',
    brandMid: '#C7CCFB',
    border: '#D2E5FA',
    bg: '#FAFBFD',
    webFont: "Pretendard, sans-serif",
    webFontTitle: "Pretendard-Bold, sans-serif",
    pptxFont: "Pretendard",
    pptxFontTitle: "Pretendard",
    pptxFontSubTitle: "Pretendard"
  },
  {
    id: 'theme-ai-chat',
    label: 'AI 챗봇 (에메랄드 그린)',
    brand: '#10A37F',
    brandDark: '#0D8065',
    brandDeep: '#085C4A',
    brandLight: '#E6F4F0',
    brandMid: '#A8DDD0',
    border: '#C8E6DF',
    bg: '#F7FBF9',
    webFont: "Pretendard, sans-serif",
    webFontTitle: "Pretendard-Bold, sans-serif",
    pptxFont: "Pretendard",
    pptxFontTitle: "Pretendard",
    pptxFontSubTitle: "Pretendard"
  },
  {
    id: 'theme-ai-dev',
    label: 'AI 개발 도구 (코랄 오렌지)',
    brand: '#D97757',
    brandDark: '#B85F3F',
    brandDeep: '#8B4530',
    brandLight: '#FDF0EB',
    brandMid: '#F4C5AE',
    border: '#F0D4C4',
    bg: '#FBF7F5',
    webFont: "Pretendard, sans-serif",
    webFontTitle: "Pretendard-Bold, sans-serif",
    pptxFont: "Pretendard",
    pptxFontTitle: "Pretendard",
    pptxFontSubTitle: "Pretendard"
  },
  {
    id: 'theme-knowledge',
    label: '노트 & 지식관리 (인디고 퍼플)',
    brand: '#6366F1',
    brandDark: '#4F46E5',
    brandDeep: '#3730A3',
    brandLight: '#EEF0FE',
    brandMid: '#C7CCFB',
    border: '#D8DCFB',
    bg: '#F8F9FE',
    webFont: "Pretendard, sans-serif",
    webFontTitle: "Pretendard-Bold, sans-serif",
    pptxFont: "Pretendard",
    pptxFontTitle: "Pretendard",
    pptxFontSubTitle: "Pretendard"
  },
  {
    id: 'theme-luxury-black',
    label: 'Luxury Black (모노톤)',
    brand: '#111111',
    brandDark: '#1F2937',
    brandDeep: '#111827',
    brandLight: '#F3F4F6',
    brandMid: '#E5E7EB',
    border: '#E5E7EB',
    bg: '#FFFFFF',
    webFont: "Pretendard, sans-serif",
    webFontTitle: "Pretendard-Bold, sans-serif",
    pptxFont: "Pretendard",
    pptxFontTitle: "Pretendard",
    pptxFontSubTitle: "Pretendard"
  }
];

export default function SubUtilities() {
  const { toast } = useToast();

  const [presetThemes, setPresetThemes] = useState<any[]>(FALLBACK_PRESET_THEMES);

  useEffect(() => {
    const fetchPresetThemes = async () => {
      try {
        const res = await fetch("/api/list-styles");
        if (res.ok) {
          const data = await res.json();
          const list = Object.entries(data).map(([key, val]: [string, any]) => ({
            id: key,
            label: val.label || key,
            brand: val.brand,
            brandDark: val.brandDark,
            brandDeep: val.brandDeep,
            brandLight: val.brandLight,
            brandMid: val.brandMid || '#E2E8F0',
            border: val.border || '#E2E8F0',
            bg: val.bg || '#FFFFFF',
            webFont: val.webFont,
            webFontTitle: val.webFontTitle,
            pptxFont: val.pptxFont,
            pptxFontTitle: val.pptxFontTitle,
            pptxFontSubTitle: val.pptxFontSubTitle
          }));
          setPresetThemes(list);
        }
      } catch (err) {
        console.error("Failed to load preset themes:", err);
      }
    };
    fetchPresetThemes();
  }, []);

  // Dictionary Colors
  const [dictionaryColors, setDictionaryColors] = useState<string[]>([]);
  
  // Contrast Checker States
  const [inspectColor, setInspectColor] = useState('#2789F5');
  const [inspectColorInput, setInspectColorInput] = useState('#2789F5');

  // Custom Theme Creator States (사용자가 주도적으로 메인, 서브, 강조색 등을 조합)
  const [themeForm, setThemeForm] = useState({
    label: '커스텀 추천 테마',
    brand: '#2789F5',
    brandDark: '#1E71CE',
    brandDeep: '#0F478F',
    brandLight: '#F0F7FF',
    brandMid: '#C7CCFB',
    border: '#D2E5FA',
    bg: '#FAFBFD',
    webFont: 'Pretendard, sans-serif',
    webFontTitle: 'Pretendard-Bold, sans-serif',
    pptxFont: 'Pretendard',
    pptxFontTitle: 'Pretendard',
    pptxFontSubTitle: 'Pretendard'
  });
  const [newCustomThemeId, setNewCustomThemeId] = useState('custom-theme-1');

  // Remapper States
  const [file, setFile] = useState<File | null>(null);
  const [slideCount, setSlideCount] = useState<number>(0);
  const [detectedColors, setDetectedColors] = useState<Array<{ hex: string; count: number }>>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultName, setResultName] = useState('');

  // Contrast computations
  const contrastWithWhite = getContrast(inspectColor, '#FFFFFF');
  const contrastWithBlack = getContrast(inspectColor, '#000000');

  // Load existing styles to build the dictionary colors list
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



  const ratingWhite = getWCAGRating(contrastWithWhite);
  const ratingBlack = getWCAGRating(contrastWithBlack);

  // Apply Preset theme into the form
  const handleApplyPreset = (preset: any) => {
    setThemeForm({
      label: preset.label,
      brand: preset.brand,
      brandDark: preset.brandDark,
      brandDeep: preset.brandDeep,
      brandLight: preset.brandLight,
      brandMid: preset.brandMid || '#E2E8F0',
      border: preset.border,
      bg: preset.bg,
      webFont: preset.webFont,
      webFontTitle: preset.webFontTitle,
      pptxFont: preset.pptxFont,
      pptxFontTitle: preset.pptxFontTitle,
      pptxFontSubTitle: preset.pptxFontSubTitle
    });
    setNewCustomThemeId(preset.id.replace('theme-', ''));
  };

  const handleFormChange = (key: string, val: string) => {
    setThemeForm(prev => ({ ...prev, [key]: val }));
  };

  // Save Custom Theme to styles.json via API
  const handleAddThemeToSystem = async () => {
    try {
      const res = await fetch('/api/list-styles');
      if (!res.ok) throw new Error('기존 스타일을 가져오지 못했습니다.');
      const styles = await res.json();

      const key = newCustomThemeId.trim().toLowerCase();
      if (!key) {
        toast({
          title: '오류',
          description: '등록할 테마 ID(영문 키)를 입력해 주세요.',
          variant: 'destructive'
        });
        return;
      }

      if (styles[key]) {
        toast({
          title: '중복 키 오류',
          description: `이미 "${key}" 키가 디자인 시스템에 존재합니다. 다른 키 이름을 써주세요.`,
          variant: 'destructive'
        });
        return;
      }

      styles[key] = {
        label: themeForm.label,
        brand: themeForm.brand,
        brandDark: themeForm.brandDark,
        brandDeep: themeForm.brandDeep,
        brandLight: themeForm.brandLight,
        brandMid: themeForm.brandMid,
        border: themeForm.border,
        bg: themeForm.bg,
        webFont: themeForm.webFont,
        webFontTitle: themeForm.webFontTitle,
        pptxFont: themeForm.pptxFont,
        pptxFontTitle: themeForm.pptxFontTitle,
        pptxFontSubTitle: themeForm.pptxFontSubTitle
      };

      const saveRes = await fetch('/api/save-styles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ styles })
      });

      if (saveRes.ok) {
        toast({
          title: '디자인 시스템 테마 추가 완료',
          description: `테마 "${themeForm.label}"(키: ${key})가 V2 styles.json에 성공적으로 영구 등록되었습니다!`,
        });
        loadDictionaryColors();
      } else {
        throw new Error('서버 저장 실패');
      }
    } catch (err: any) {
      toast({
        title: '등록 실패',
        description: err.message,
        variant: 'destructive'
      });
    }
  };

  // Remapper: Handle File Upload
  const handleRemapperUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setLoading(true);
    setStatusMessage('PPTX 파일 로드 및 색상 검사 중...');
    
    try {
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);
      
      const slideKeys = Object.keys(zip.files).filter(k => /^ppt\/slides\/slide\d+\.xml$/.test(k));
      setSlideCount(slideKeys.length);

      const colorsMap: Record<string, number> = {};
      for (const k of Object.keys(zip.files)) {
        const f = zip.files[k];
        if (f.dir || !k.endsWith('.xml')) continue;
        const txt = await f.async('string');
        
        let m;
        const r1 = /srgbClr val="([A-Fa-f0-9]{6})"/gi;
        while ((m = r1.exec(txt)) !== null) {
          const h = m[1].toUpperCase();
          colorsMap[h] = (colorsMap[h] || 0) + 1;
        }
        const r2 = /lastClr="([A-Fa-f0-9]{6})"/gi;
        while ((m = r2.exec(txt)) !== null) {
          const h = m[1].toUpperCase();
          colorsMap[h] = (colorsMap[h] || 0) + 1;
        }
      }

      const list = Object.entries(colorsMap)
        .map(([hex, count]) => ({ hex, count }))
        .sort((a, b) => b.count - a.count);

      setDetectedColors(list);
      
      const initialMap: Record<string, string> = {};
      list.forEach(item => {
        initialMap[item.hex] = item.hex;
      });
      setMappings(initialMap);

      toast({
        title: 'PPTX 분석 완료',
        description: `총 ${slideKeys.length}개 슬라이드에서 ${list.length}개의 색상을 감지했습니다.`,
      });
    } catch (err: any) {
      toast({
        title: '파일 분석 실패',
        description: err.message,
        variant: 'destructive'
      });
      setFile(null);
    } finally {
      setLoading(false);
      setStatusMessage('');
    }
  };

  const handleRemapChange = (fromHex: string, toHex: string) => {
    const cleanTo = toHex.replace('#', '').toUpperCase();
    if (cleanTo.length === 6 && /^[0-9A-Fa-f]{6}$/.test(cleanTo)) {
      setMappings(prev => ({ ...prev, [fromHex]: cleanTo }));
    } else {
      setMappings(prev => ({ ...prev, [fromHex]: toHex }));
    }
  };

  const handleRunRemap = async () => {
    if (!file) return;
    setLoading(true);
    setStatusMessage('PPTX 내부 XML 색상 치환 가공 중...');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);
      
      const activeRemaps = Object.entries(mappings).filter(([from, to]) => {
        const cleanTo = to.replace('#', '').toUpperCase();
        return cleanTo.length === 6 && /^[0-9A-Fa-f]{6}$/.test(cleanTo) && from !== cleanTo;
      });

      if (activeRemaps.length === 0) {
        toast({
          title: '알림',
          description: '변경된 매핑 정보가 없거나 올바르지 않습니다.',
        });
        setLoading(false);
        setStatusMessage('');
        return;
      }

      let changedFiles = 0;
      let totalReps = 0;

      for (const k of Object.keys(zip.files)) {
        const f = zip.files[k];
        if (f.dir || !k.endsWith('.xml')) continue;
        let txt = await f.async('string');
        let fileChanged = false;

        for (const [from, to] of activeRemaps) {
          const cleanTo = to.replace('#', '').toUpperCase();
          const re = new RegExp(from, 'gi');
          const hits = (txt.match(re) || []).length;
          if (hits > 0) {
            txt = txt.replace(re, cleanTo);
            totalReps += hits;
            fileChanged = true;
          }
        }

        if (fileChanged) {
          zip.file(k, txt, { compression: 'DEFLATE' });
          changedFiles++;
        }
      }

      setStatusMessage('새로운 PPTX 바이너리 패키징 중...');
      const blob = await zip.generateAsync({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      });

      const outName = file.name.replace(/\.pptx?$/i, '') + '_색상변경.pptx';
      setResultBlob(blob);
      setResultName(outName);

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = outName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: '변환 및 다운로드 완료',
        description: `총 ${changedFiles}개 XML에서 ${totalReps}개의 색상이 교체되었습니다.`,
      });
    } catch (err: any) {
      toast({
        title: '변환 실패',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
      setStatusMessage('');
    }
  };

  return (
    <div className="space-y-6 text-slate-800">
      
      {/* SECTION 1: 개별 색상 사전 및 대비 검사기 */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="border-b border-slate-200 pb-3">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Palette className="h-4 w-4 text-blue-600" /> 1. 개별 색상 사전 및 대비 검사기
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            디자인 시스템(`styles.json`)에 등록된 단색 칩을 클릭하거나 수동 입력하여 흰색/검은색 배경 대비를 가시적으로 비교하고 가독성을 판별합니다.
          </p>
        </div>

        {/* Dictionary Color Palette list */}
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

          {/* WCAG AA/AAA 가독성 판별 결과 프리뷰 카드 3선 */}
          <div className="md:col-span-7 space-y-3">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">배경 대비도 실시간 가시적 판별 프리뷰</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* White BG with Color Text */}
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

              {/* Black BG with Color Text */}
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

              {/* Color BG with White & Black text comparison */}
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
        </div>
      </div>

      {/* SECTION 2: 추천 테마 프리셋 & 사용자 커스텀 배색 테마 빌더 */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="border-b border-slate-200 pb-3">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-500" /> 2. 추천 테마 프리셋 & 커스텀 배색 빌더 (그룹 연동)
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            디자이너 큐레이션 프리셋을 가져오거나, 사용자가 **직접 메인·서브·강조 색상을 선택 조합**하여 디자인 시스템 테마를 새로 정의할 수 있습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Control Panel: Preset selection & Custom Palette picker */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* A. Preset Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">A. 추천 디자이너 프리셋 불러오기</label>
              <div className="grid grid-cols-2 gap-2">
                {presetThemes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleApplyPreset(theme)}
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

            {/* B. Custom Palette Builder (메인, 서브, 강조색 직접 조합) */}
            <div className="border-t border-slate-200 pt-3.5 space-y-3">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Settings className="h-3.5 w-3.5 text-blue-600" /> B. 메인·서브·강조색 직접 조합 조율
              </label>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-4 text-xs">
                
                {/* Theme name Korean */}
                <div className="space-y-1">
                  <label className="text-slate-500 text-xs font-bold block">테마 한글 명칭</label>
                  <input
                    type="text"
                    value={themeForm.label}
                    onChange={(e) => handleFormChange('label', e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-slate-800 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  {/* Brand Color (Main) */}
                  <div className="space-y-1">
                    <label className="text-slate-500 text-xs font-bold block">메인 주컬러 (Brand)</label>
                    <div className="flex gap-1.5">
                      <input
                        type="color"
                        value={themeForm.brand}
                        onChange={(e) => handleFormChange('brand', e.target.value)}
                        className="w-6 h-6 p-0.5 bg-transparent border border-slate-200 rounded cursor-pointer shrink-0"
                      />
                      <input
                        type="text"
                        value={themeForm.brand}
                        onChange={(e) => handleFormChange('brand', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-800 font-mono text-center uppercase"
                      />
                    </div>
                  </div>

                  {/* Brand Dark (Sub Dark) */}
                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold block">서브 어두운톤 (Dark)</label>
                    <div className="flex gap-1.5">
                      <input
                        type="color"
                        value={themeForm.brandDark}
                        onChange={(e) => handleFormChange('brandDark', e.target.value)}
                        className="w-6 h-6 p-0.5 bg-transparent border border-slate-200 rounded cursor-pointer shrink-0"
                      />
                      <input
                        type="text"
                        value={themeForm.brandDark}
                        onChange={(e) => handleFormChange('brandDark', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-800 font-mono text-center uppercase"
                      />
                    </div>
                  </div>

                  {/* Brand Deep */}
                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold block">강조 깊은톤 (Deep)</label>
                    <div className="flex gap-1.5">
                      <input
                        type="color"
                        value={themeForm.brandDeep}
                        onChange={(e) => handleFormChange('brandDeep', e.target.value)}
                        className="w-6 h-6 p-0.5 bg-transparent border border-slate-200 rounded cursor-pointer shrink-0"
                      />
                      <input
                        type="text"
                        value={themeForm.brandDeep}
                        onChange={(e) => handleFormChange('brandDeep', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-800 font-mono text-center uppercase"
                      />
                    </div>
                  </div>

                  {/* Brand Light */}
                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold block">강조 연한배경 (Light)</label>
                    <div className="flex gap-1.5">
                      <input
                        type="color"
                        value={themeForm.brandLight}
                        onChange={(e) => handleFormChange('brandLight', e.target.value)}
                        className="w-6 h-6 p-0.5 bg-transparent border border-slate-200 rounded cursor-pointer shrink-0"
                      />
                      <input
                        type="text"
                        value={themeForm.brandLight}
                        onChange={(e) => handleFormChange('brandLight', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-800 font-mono text-center uppercase"
                      />
                    </div>
                  </div>

                  {/* Bg */}
                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold block">기본 배경색 (Bg)</label>
                    <div className="flex gap-1.5">
                      <input
                        type="color"
                        value={themeForm.bg}
                        onChange={(e) => handleFormChange('bg', e.target.value)}
                        className="w-6 h-6 p-0.5 bg-transparent border border-slate-200 rounded cursor-pointer shrink-0"
                      />
                      <input
                        type="text"
                        value={themeForm.bg}
                        onChange={(e) => handleFormChange('bg', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-800 font-mono text-center uppercase"
                      />
                    </div>
                  </div>

                  {/* Border */}
                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold block">경계 테두리선 (Border)</label>
                    <div className="flex gap-1.5">
                      <input
                        type="color"
                        value={themeForm.border}
                        onChange={(e) => handleFormChange('border', e.target.value)}
                        className="w-6 h-6 p-0.5 bg-transparent border border-slate-200 rounded cursor-pointer shrink-0"
                      />
                      <input
                        type="text"
                        value={themeForm.border}
                        onChange={(e) => handleFormChange('border', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-800 font-mono text-center uppercase"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-1.5 pt-1.5 border-t border-slate-200">
                  <button
                    onClick={() => handleApplyPreset(presetThemes[0] || FALLBACK_PRESET_THEMES[0])}
                    className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-0.5 font-semibold"
                  >
                    <RotateCcw className="w-3 h-3" /> 초기화
                  </button>
                </div>
              </div>
            </div>

            {/* Export Theme to styles.json */}
            <div className="border-t border-slate-200 pt-3.5 space-y-2 bg-slate-50 p-4 rounded-xl">
              <div className="text-xs font-bold text-slate-700">설정한 커스텀 테마를 디자인 시스템에 등록</div>
              <p className="text-xs text-slate-500 leading-normal">
                설정한 배색 조합 전체를 `styles.json`에 신규 영문 ID 테마로 추가합니다. 등록 후 마크다운 frontmatter에 적어 직접 컴파일할 수 있습니다.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCustomThemeId}
                  onChange={(e) => setNewCustomThemeId(e.target.value)}
                  placeholder="예: custom-navy-group"
                  className="bg-white border border-slate-400 rounded px-2.5 py-1.5 text-xs font-mono text-slate-800 flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddThemeToSystem}
                  className="bg-blue-600 hover:bg-blue-600 text-white font-semibold px-3 py-1.5 rounded text-xs flex items-center gap-1 transition-all shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" /> 시스템 등록
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Mock Layout Preview */}
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
              {/* Header section mockup */}
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

              {/* Body Content Card mockup */}
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
                  {/* brandMid color block indicator */}
                  <div 
                    className="text-xs p-1.5 rounded border text-center font-bold"
                    style={{ backgroundColor: themeForm.brandMid, borderColor: themeForm.border, color: themeForm.brandDeep }}
                  >
                    중간톤 블록 (Mid Color)
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="flex justify-between items-center text-xs text-slate-400 border-t pt-2.5" style={{ borderColor: themeForm.border }}>
                <span className="font-semibold">© Creative Spark V2.0 Custom Theme Builder</span>
                <span className="font-mono text-[10px]">{themeForm.brand} / {themeForm.brandDeep}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: 초경량 PPTX 컬러 리매퍼 */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="border-b border-slate-200 pb-3">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <HelpCircle className="h-4 w-4 text-blue-500" /> 3. 초경량 PPTX 컬러 리매퍼 (일괄 색상 강제 교체)
          </h3>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-900 leading-relaxed">
            <strong>초경량 PPTX 컬러 리매퍼란?</strong><br />
            이 도구는 가이드 문서 변환과는 관련이 없는 **단독 보조 유틸리티**입니다.
            기존에 작성된 일반 파워포인트(PPTX) 파일을 업로드하여, 그 안에 쓰인 특정 구형 색상(예: 옛날 회사 로고색, 원색 빨강 등)을 사용자가 원하는 세련된 신규 색상으로 **PPTX 내부 XML 상에서 1:1 강제 일괄 치환**해 줍니다. 
          </div>
        </div>

        {!file ? (
          <div className="border-2 dashed border-slate-200 bg-slate-50 rounded-xl p-8 text-center space-y-3">
            <Upload className="h-8 w-8 text-slate-400 mx-auto" />
            <div>
              <strong className="text-sm text-slate-700 block">색상을 변경할 PPTX 파일 드래그 & 드롭</strong>
              <span className="text-xs text-slate-400 block mt-1">파일은 서버로 가거나 외부로 전송되지 않고 브라우저 로컬에서 안전하게 변환됩니다.</span>
            </div>
            <label className="inline-block bg-blue-600 hover:bg-blue-600 text-white font-semibold text-sm px-4 py-2 rounded transition-colors shadow-sm cursor-pointer">
              파일 선택
              <input type="file" onChange={handleRemapperUpload} accept=".pptx" className="hidden" />
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            {/* File info bar */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center justify-between flex-wrap gap-2 text-sm">
              <div className="flex items-center gap-2">
                <FileCheck className="h-4 w-4 text-blue-600" />
                <div>
                  <strong className="text-blue-900">{file.name}</strong>
                  <span className="text-blue-600 block text-xs mt-0.5">슬라이드: {slideCount}개 | 검출 색상: {detectedColors.length}개</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setFile(null);
                  setDetectedColors([]);
                  setResultBlob(null);
                }}
                className="text-xs text-slate-500 hover:text-slate-800 underline"
              >
                다른 파일 올리기
              </button>
            </div>

            {/* Color mappings table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden max-h-[300px] overflow-y-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="p-3">감지된 원래 색상 (From)</th>
                    <th className="p-3">사용 빈도</th>
                    <th className="p-3">변경할 타겟 색상 (To)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {detectedColors.map((item) => (
                    <tr key={item.hex} className="hover:bg-slate-50/50">
                      <td className="p-3 flex items-center gap-2">
                        <div className="w-5.5 h-5.5 rounded border border-slate-200" style={{ backgroundColor: `#${item.hex}` }} />
                        <strong className="font-mono text-slate-800">#{item.hex}</strong>
                      </td>
                      <td className="p-3 font-semibold text-slate-500">
                        {item.count}회 사용됨
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={mappings[item.hex] ? (mappings[item.hex].startsWith('#') ? mappings[item.hex] : `#${mappings[item.hex]}`) : `#${item.hex}`}
                            onChange={(e) => handleRemapChange(item.hex, e.target.value)}
                            className="w-6 h-6 p-0.5 border border-slate-200 rounded cursor-pointer bg-transparent"
                          />
                          <input
                            type="text"
                            value={mappings[item.hex] || item.hex}
                            onChange={(e) => handleRemapChange(item.hex, e.target.value)}
                            placeholder="HEX 코드"
                            className="border border-slate-200 rounded px-2 py-1 text-sm font-mono uppercase text-slate-800 w-24 focus:outline-none focus:border-blue-500"
                          />
                          {mappings[item.hex] !== item.hex && (
                            <button
                              onClick={() => handleRemapChange(item.hex, item.hex)}
                              className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                              title="초기화"
                            >
                              복원
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Status or Result block */}
            {loading && (
              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg flex items-center gap-3.5 text-sm text-slate-600">
                <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                <span>{statusMessage}</span>
              </div>
            )}

            {resultBlob && (
              <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-lg flex items-center justify-between text-xs text-emerald-800">
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-600" />
                  <div>
                    <strong>색상 변경 파일 다운로드 완료!</strong>
                    <span className="block text-[10px] text-emerald-600 mt-0.5">다운로드가 차단되었을 경우 우측 재다운로드 버튼을 클릭해 주세요.</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const url = URL.createObjectURL(resultBlob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = resultName;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-550 text-white font-semibold px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" /> 재다운로드
                </button>
              </div>
            )}

            {/* Run button */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handleRunRemap}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-550 text-white font-semibold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
              >
                <Download className="h-4 w-4" /> 리매핑 일괄 실행 및 다운로드
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
