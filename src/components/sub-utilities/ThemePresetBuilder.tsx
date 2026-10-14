import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ThemePresetSelector from './ThemePresetSelector';
import PaletteBuilderForm from './PaletteBuilderForm';
import PaletteLivePreview from './PaletteLivePreview';
import type { ThemeFormShape } from './theme-form';

const FALLBACK_PRESET_THEMES = [
  {
    id: 'theme-custom-blue', label: '페이퍼로지 오리지널 (블루)',
    brand: '#2789F5', brandDark: '#1E71CE', brandDeep: '#0F478F', brandLight: '#F0F7FF', brandMid: '#C7CCFB',
    border: '#D2E5FA', bg: '#FAFBFD',
    webFont: "Pretendard, sans-serif", webFontTitle: "Pretendard-Bold, sans-serif",
    pptxFont: "Pretendard", pptxFontTitle: "Pretendard", pptxFontSubTitle: "Pretendard"
  },
  {
    id: 'theme-ai-chat', label: 'AI 챗봇 (에메랄드 그린)',
    brand: '#10A37F', brandDark: '#0D8065', brandDeep: '#085C4A', brandLight: '#E6F4F0', brandMid: '#A8DDD0',
    border: '#C8E6DF', bg: '#F7FBF9',
    webFont: "Pretendard, sans-serif", webFontTitle: "Pretendard-Bold, sans-serif",
    pptxFont: "Pretendard", pptxFontTitle: "Pretendard", pptxFontSubTitle: "Pretendard"
  },
  {
    id: 'theme-ai-dev', label: 'AI 개발 도구 (코랄 오렌지)',
    brand: '#D97757', brandDark: '#B85F3F', brandDeep: '#8B4530', brandLight: '#FDF0EB', brandMid: '#F4C5AE',
    border: '#F0D4C4', bg: '#FBF7F5',
    webFont: "Pretendard, sans-serif", webFontTitle: "Pretendard-Bold, sans-serif",
    pptxFont: "Pretendard", pptxFontTitle: "Pretendard", pptxFontSubTitle: "Pretendard"
  },
  {
    id: 'theme-knowledge', label: '노트 & 지식관리 (인디고 퍼플)',
    brand: '#6366F1', brandDark: '#4F46E5', brandDeep: '#3730A3', brandLight: '#EEF0FE', brandMid: '#C7CCFB',
    border: '#D8DCFB', bg: '#F8F9FE',
    webFont: "Pretendard, sans-serif", webFontTitle: "Pretendard-Bold, sans-serif",
    pptxFont: "Pretendard", pptxFontTitle: "Pretendard", pptxFontSubTitle: "Pretendard"
  },
  {
    id: 'theme-luxury-black', label: 'Luxury Black (모노톤)',
    brand: '#111111', brandDark: '#1F2937', brandDeep: '#111827', brandLight: '#F3F4F6', brandMid: '#E5E7EB',
    border: '#E5E7EB', bg: '#FFFFFF',
    webFont: "Pretendard, sans-serif", webFontTitle: "Pretendard-Bold, sans-serif",
    pptxFont: "Pretendard", pptxFontTitle: "Pretendard", pptxFontSubTitle: "Pretendard"
  }
];

// SubUtilities 섹션 2: 추천 테마 프리셋 & 사용자 커스텀 배색 테마 빌더
export default function ThemePresetBuilder() {
  const { toast } = useToast();
  const [presetThemes, setPresetThemes] = useState<any[]>(FALLBACK_PRESET_THEMES);
  const [themeForm, setThemeForm] = useState<ThemeFormShape>({
    label: '커스텀 추천 테마',
    brand: '#2789F5', brandDark: '#1E71CE', brandDeep: '#0F478F', brandLight: '#F0F7FF', brandMid: '#C7CCFB',
    border: '#D2E5FA', bg: '#FAFBFD',
    webFont: 'Pretendard, sans-serif', webFontTitle: 'Pretendard-Bold, sans-serif',
    pptxFont: 'Pretendard', pptxFontTitle: 'Pretendard', pptxFontSubTitle: 'Pretendard'
  });
  const [newCustomThemeId, setNewCustomThemeId] = useState('custom-theme-1');

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

  const handleAddThemeToSystem = async () => {
    try {
      const res = await fetch('/api/list-styles');
      if (!res.ok) throw new Error('기존 스타일을 가져오지 못했습니다.');
      const styles = await res.json();

      const key = newCustomThemeId.trim().toLowerCase();
      if (!key) {
        toast({ title: '오류', description: '등록할 테마 ID(영문 키)를 입력해 주세요.', variant: 'destructive' });
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

      styles[key] = { ...themeForm };

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
      } else {
        throw new Error('서버 저장 실패');
      }
    } catch (err: any) {
      toast({ title: '등록 실패', description: err.message, variant: 'destructive' });
    }
  };

  return (
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
        <div className="lg:col-span-5 space-y-4">
          <ThemePresetSelector presetThemes={presetThemes} onApplyPreset={handleApplyPreset} />
          <PaletteBuilderForm
            themeForm={themeForm}
            newCustomThemeId={newCustomThemeId}
            onFormChange={handleFormChange}
            onNewCustomThemeIdChange={setNewCustomThemeId}
            onReset={() => handleApplyPreset(presetThemes[0] || FALLBACK_PRESET_THEMES[0])}
            onRegister={handleAddThemeToSystem}
          />
        </div>
        <PaletteLivePreview themeForm={themeForm} newCustomThemeId={newCustomThemeId} />
      </div>
    </div>
  );
}
