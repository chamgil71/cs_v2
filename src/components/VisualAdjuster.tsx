import React, { useState, useEffect } from 'react';
import { 
  Palette, 
  Save, 
  Trash2, 
  Plus, 
  RefreshCw, 
  Check, 
  BookOpen,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FALLBACK_STYLES } from '../lib/client-compiler';


interface ThemeDetails {
  label: string;
  brand: string;
  brandDark: string;
  brandDeep: string;
  brandLight: string;
  brandMid: string;
  bg: string;
  border: string;
  webFont: string;
  webFontTitle: string;
  pptxFont: string;
  pptxFontTitle: string;
  pptxFontSubTitle: string;
}

import { getContrast, getWCAGRating } from '../lib/wcag';


export default function VisualAdjuster() {
  const { toast } = useToast();
  
  const [styles, setStyles] = useState<Record<string, ThemeDetails>>({});
  const [selectedStyle, setSelectedStyle] = useState('custom-blue');
  const [editingThemeKey, setEditingThemeKey] = useState<string | null>(null);
  const [newThemeKey, setNewThemeKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasServer, setHasServer] = useState<boolean | null>(null);

  // Styling Form State
  const [themeForm, setThemeForm] = useState<ThemeDetails>({
    label: "",
    brand: "#2563FF",
    brandDark: "#1E71CE",
    brandDeep: "#0F478F",
    brandLight: "#F0F7FF",
    brandMid: "#C7CCFB",
    bg: "#F8F9FE",
    border: "#D8DCFB",
    webFont: "Pretendard, sans-serif",
    webFontTitle: "Pretendard-Bold, sans-serif",
    pptxFont: "Pretendard",
    pptxFontTitle: "Pretendard",
    pptxFontSubTitle: "Pretendard"
  });

  const contrastWithWhite = getContrast(themeForm.brand || '#2563FF', '#FFFFFF');
  const contrastWithBlack = getContrast(themeForm.brand || '#2563FF', '#000000');
  const ratingWhite = getWCAGRating(contrastWithWhite);
  const ratingBlack = getWCAGRating(contrastWithBlack);

  // Fetch styles from backend; sets hasServer based on API availability
  const fetchStyles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/list-styles");
      if (res.ok) {
        const data = await res.json();
        setStyles(data);
        setHasServer(true);
        if (data[selectedStyle]) {
          setThemeForm({ ...data[selectedStyle] });
          setEditingThemeKey(selectedStyle);
        } else if (Object.keys(data).length > 0) {
          const firstKey = Object.keys(data)[0];
          setSelectedStyle(firstKey);
          setThemeForm({ ...data[firstKey] });
          setEditingThemeKey(firstKey);
        }
      } else {
        throw new Error("API unavailable");
      }
    } catch (err) {
      console.error("Failed to load styles, using fallback:", err);
      const data = FALLBACK_STYLES as Record<string, any>;
      setStyles(data);
      setHasServer(false);
      const firstKey = data[selectedStyle] ? selectedStyle : Object.keys(data)[0];
      if (firstKey) {
        setSelectedStyle(firstKey);
        setThemeForm({ ...data[firstKey] });
        setEditingThemeKey(firstKey);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStyles();
  }, []);

  const handleSelectStyle = (key: string) => {
    setSelectedStyle(key);
    if (styles[key]) {
      setThemeForm({ ...styles[key] });
      setEditingThemeKey(key);
    }
  };

  const handleFormChange = (field: keyof ThemeDetails, val: string) => {
    setThemeForm(prev => ({ ...prev, [field]: val }));
  };

  // Add/Edit theme locally
  const handleAddOrEditTheme = () => {
    if (editingThemeKey) {
      // Edit existing
      setStyles(prev => ({
        ...prev,
        [editingThemeKey]: { ...themeForm }
      }));
      toast({
        title: "테마 임시 수정 완료",
        description: `"${themeForm.label}" 테마가 로컬 상태에서 수정되었습니다. [서버에 최종 저장]을 눌러 반영하세요.`,
      });
    } else {
      // Add new
      const key = newThemeKey.trim().toLowerCase();
      if (!key) {
        toast({
          title: "입력 오류",
          description: "새 테마 키(ID)를 입력해 주세요.",
          variant: "destructive"
        });
        return;
      }
      if (styles[key]) {
        toast({
          title: "중복 오류",
          description: "이미 존재하는 테마 키(ID)입니다.",
          variant: "destructive"
        });
        return;
      }
      if (!themeForm.label.trim()) {
        toast({
          title: "입력 오류",
          description: "테마 한글명을 입력해 주세요.",
          variant: "destructive"
        });
        return;
      }
      setStyles(prev => ({
        ...prev,
        [key]: { ...themeForm }
      }));
      setSelectedStyle(key);
      setEditingThemeKey(key);
      setNewThemeKey("");
      toast({
        title: "테마 임시 추가 완료",
        description: `"${themeForm.label}" 테마가 로컬 상태에 추가되었습니다. [서버에 최종 저장]을 눌러 반영하세요.`,
      });
    }
  };

  const handleDeleteTheme = (keyToDelete: string) => {
    if (keyToDelete === "custom-blue" || keyToDelete === "ai-chat") {
      toast({
        title: "삭제 불가능",
        description: "기본 테마는 삭제할 수 없습니다.",
        variant: "destructive"
      });
      return;
    }
    const newStyles = { ...styles };
    delete newStyles[keyToDelete];
    setStyles(newStyles);
    
    if (selectedStyle === keyToDelete) {
      const first = Object.keys(newStyles)[0] || "custom-blue";
      setSelectedStyle(first);
      if (newStyles[first]) setThemeForm({ ...newStyles[first] });
    }
    
    toast({
      title: "테마 임시 삭제 완료",
      description: "테마가 로컬 상태에서 삭제되었습니다. [서버에 최종 저장]을 눌러 반영하세요.",
    });
  };

  // Save styles to backend
  const handleSaveStylesToServer = async () => {
    if (hasServer === false) {
      toast({
        title: "서버 미연결",
        description: "styles.json 서버 저장은 로컬 개발 서버(npm run dev)가 실행 중일 때만 사용할 수 있습니다.",
        variant: "destructive",
      });
      return;
    }
    try {
      const res = await fetch("/api/save-styles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ styles }),
      });
      if (res.ok) {
        toast({
          title: "서버 저장 성공",
          description: "모든 테마 변경사항이 styles.json에 완벽히 저장되었습니다.",
        });
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to save styles");
      }
    } catch (err: any) {
      toast({
        title: "서버 저장 실패",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-slate-800">
      {/* Themes List Panel */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <Palette className="h-4 w-4 text-blue-600" /> 디자인 테마 프리셋
          </h3>
          <button
            onClick={fetchStyles}
            disabled={loading}
            className="text-slate-500 hover:text-slate-700"
            title="새로고침"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Styles Radio List */}
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {Object.entries(styles).map(([key, value]) => (
            <div 
              key={key}
              onClick={() => handleSelectStyle(key)}
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
                    handleDeleteTheme(key);
                  }}
                  className="text-slate-400 hover:text-red-500 p-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add new theme key */}
        <div className="border-t border-slate-200 pt-3 space-y-2">
          <div className="text-xs font-semibold text-slate-500">새 테마 추가</div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="theme-id-name"
              value={newThemeKey}
              onChange={(e) => setNewThemeKey(e.target.value)}
              className="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-850 font-mono flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={() => {
                setEditingThemeKey(null);
                setThemeForm({
                  label: "새 테마",
                  brand: "#3B82F6",
                  brandDark: "#1D4ED8",
                  brandDeep: "#1E3A8A",
                  brandLight: "#EFF6FF",
                  brandMid: "#BFDBFE",
                  bg: "#F8FAFC",
                  border: "#E2E8F0",
                  webFont: "Pretendard, sans-serif",
                  webFontTitle: "Pretendard-Bold, sans-serif",
                  pptxFont: "Pretendard",
                  pptxFontTitle: "Pretendard",
                  pptxFontSubTitle: "Pretendard"
                });
                handleAddOrEditTheme();
              }}
              className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded text-xs flex items-center gap-1 transition-colors font-semibold"
            >
              <Plus className="h-3 w-3" /> 추가
            </button>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-3 flex gap-2">
          <button
            onClick={handleSaveStylesToServer}
            disabled={hasServer === false}
            title={hasServer === false ? "로컬 개발 서버(npm run dev) 연결 시에만 사용 가능합니다" : undefined}
            className="flex-1 bg-blue-600 hover:bg-blue-550 text-white font-semibold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Save className="h-3.5 w-3.5" />
            {hasServer === false ? "서버 미연결 (저장 불가)" : "서버에 최종 저장하기"}
          </button>
        </div>
      </div>

      {/* Editor & Adjuster Controls Panel */}
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
              onChange={(e) => handleFormChange('label', e.target.value)}
              className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="space-y-1">
              <label className="text-slate-500 font-semibold block">브랜드 주컬러 (Brand)</label>
              <div className="flex gap-1.5">
                <input
                  type="color"
                  value={themeForm.brand}
                  onChange={(e) => handleFormChange('brand', e.target.value)}
                  className="w-7 h-7 p-0.5 bg-transparent border border-slate-200 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={themeForm.brand}
                  onChange={(e) => handleFormChange('brand', e.target.value)}
                  className="bg-white border border-slate-200 rounded px-1.5 py-1 text-slate-800 font-mono text-center flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-slate-500 font-semibold block">브랜드 어두운톤 (Dark)</label>
              <div className="flex gap-1.5">
                <input
                  type="color"
                  value={themeForm.brandDark}
                  onChange={(e) => handleFormChange('brandDark', e.target.value)}
                  className="w-7 h-7 p-0.5 bg-transparent border border-slate-200 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={themeForm.brandDark}
                  onChange={(e) => handleFormChange('brandDark', e.target.value)}
                  className="bg-white border border-slate-200 rounded px-1.5 py-1 text-slate-800 font-mono text-center flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-500 font-semibold block">브랜드 깊은톤 (Deep)</label>
              <div className="flex gap-1.5">
                <input
                  type="color"
                  value={themeForm.brandDeep}
                  onChange={(e) => handleFormChange('brandDeep', e.target.value)}
                  className="w-7 h-7 p-0.5 bg-transparent border border-slate-200 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={themeForm.brandDeep}
                  onChange={(e) => handleFormChange('brandDeep', e.target.value)}
                  className="bg-white border border-slate-200 rounded px-1.5 py-1 text-slate-800 font-mono text-center flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-slate-500 font-semibold block">브랜드 밝은톤 (Light)</label>
              <div className="flex gap-1.5">
                <input
                  type="color"
                  value={themeForm.brandLight}
                  onChange={(e) => handleFormChange('brandLight', e.target.value)}
                  className="w-7 h-7 p-0.5 bg-transparent border border-slate-200 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={themeForm.brandLight}
                  onChange={(e) => handleFormChange('brandLight', e.target.value)}
                  className="bg-white border border-slate-200 rounded px-1.5 py-1 text-slate-800 font-mono text-center flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-500 font-semibold block">브랜드 중간톤 (Mid)</label>
              <div className="flex gap-1.5">
                <input
                  type="color"
                  value={themeForm.brandMid}
                  onChange={(e) => handleFormChange('brandMid', e.target.value)}
                  className="w-7 h-7 p-0.5 bg-transparent border border-slate-200 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={themeForm.brandMid}
                  onChange={(e) => handleFormChange('brandMid', e.target.value)}
                  className="bg-white border border-slate-200 rounded px-1.5 py-1 text-slate-800 font-mono text-center flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-slate-500 font-semibold block">테두리선 색 (Border)</label>
              <div className="flex gap-1.5">
                <input
                  type="color"
                  value={themeForm.border}
                  onChange={(e) => handleFormChange('border', e.target.value)}
                  className="w-7 h-7 p-0.5 bg-transparent border border-slate-200 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={themeForm.border}
                  onChange={(e) => handleFormChange('border', e.target.value)}
                  className="bg-white border border-slate-200 rounded px-1.5 py-1 text-slate-800 font-mono text-center flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-500 font-semibold block">연한 본문 배경색 (Bg)</label>
            <div className="flex gap-1.5">
              <input
                type="color"
                value={themeForm.bg}
                onChange={(e) => handleFormChange('bg', e.target.value)}
                className="w-7 h-7 p-0.5 bg-transparent border border-slate-200 rounded cursor-pointer"
              />
              <input
                type="text"
                value={themeForm.bg}
                onChange={(e) => handleFormChange('bg', e.target.value)}
                className="bg-white border border-slate-200 rounded px-1.5 py-1 text-slate-800 font-mono text-center flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-3 pt-3 border-t border-slate-200">
            <div className="font-semibold text-slate-600">글꼴(Font) 패밀리 매핑</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-18 text-slate-500 text-xs shrink-0 font-medium">웹 타이틀:</span>
                <input
                  type="text"
                  value={themeForm.webFontTitle}
                  onChange={(e) => handleFormChange('webFontTitle', e.target.value)}
                  className="bg-white border border-slate-200 rounded px-2.5 py-1 text-slate-850 flex-1 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-18 text-slate-500 text-xs shrink-0 font-medium">웹 본문:</span>
                <input
                  type="text"
                  value={themeForm.webFont}
                  onChange={(e) => handleFormChange('webFont', e.target.value)}
                  className="bg-white border border-slate-200 rounded px-2.5 py-1 text-slate-855 flex-1 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-18 text-slate-500 text-xs shrink-0 font-medium">PPTX 서체:</span>
                <input
                  type="text"
                  value={themeForm.pptxFont}
                  onChange={(e) => handleFormChange('pptxFont', e.target.value)}
                  className="bg-white border border-slate-200 rounded px-2.5 py-1 text-slate-855 flex-1 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleAddOrEditTheme}
          className="w-full bg-blue-600 hover:bg-blue-600 text-white text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1 transition-colors shadow-sm"
        >
          <Check className="h-4 w-4" /> 현재 테마 설정에 임시 저장 (로컬)
        </button>
      </div>

      {/* Visual Live Preview Panel */}
      <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-emerald-600" /> 실시간 컴포넌트 프리뷰
          </h3>
          <p className="text-xs text-slate-500 mt-0.5 font-semibold">수정된 테마 색상이 시각 컴포넌트에 즉시 적용되어 표시됩니다.</p>
        </div>

        {/* Mock Component Preview Box */}
        <div className="my-6 space-y-4 bg-slate-50 border border-slate-200 p-4 rounded-xl flex-1 flex flex-col justify-center min-h-[300px]">
          {/* Card Component Preview */}
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

          {/* Stat Box Component Preview */}
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

          {/* Color Palettes Bar Visual */}
          <div className="flex gap-1 h-3 rounded-full overflow-hidden border border-slate-200">
            <div className="flex-1" style={{ backgroundColor: themeForm.brand }} title="Brand" />
            <div className="flex-1" style={{ backgroundColor: themeForm.brandDark }} title="Dark" />
            <div className="flex-1" style={{ backgroundColor: themeForm.brandDeep }} title="Deep" />
            <div className="flex-1" style={{ backgroundColor: themeForm.brandMid }} title="Mid" />
            <div className="flex-1" style={{ backgroundColor: themeForm.brandLight }} title="Light" />
          </div>

          {/* Real-time WCAG contrast check visual report (3-cards comparison) */}
          <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2.5">
            <div className="text-xs uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" /> 
              WCAG 명도 가독성 실시간 판정
            </div>

            <div className="grid grid-cols-3 gap-1.5 text-xs font-semibold text-slate-800">
              {/* Card 1: White BG */}
              <div className="bg-white border border-slate-200 p-2 rounded shadow-sm flex flex-col justify-between h-[80px]">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block">White BG</span>
                <span style={{ color: themeForm.brand }} className="font-extrabold truncate">가독성 검증</span>
                <span className={`text-xs font-bold ${ratingWhite.color} text-right mt-1`}>
                  {contrastWithWhite.toFixed(1)}:1 ({contrastWithWhite >= 4.5 ? 'AA통과' : '부적합'})
                </span>
              </div>

              {/* Card 2: Black BG */}
              <div className="bg-black border border-slate-800 p-2 rounded shadow-sm text-white flex flex-col justify-between h-[80px]">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block">Black BG</span>
                <span style={{ color: themeForm.brand }} className="font-extrabold truncate">가독성 검증</span>
                <span className={`text-xs font-bold ${ratingBlack.color} text-right mt-1`}>
                  {contrastWithBlack.toFixed(1)}:1 ({contrastWithBlack >= 4.5 ? 'AA통과' : '부적합'})
                </span>
              </div>

              {/* Card 3: Color Block BG */}
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
    </div>
  );
}
