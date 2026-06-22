import React, { useState, useRef, useEffect } from 'react';
import JSZip from 'jszip';
import {
  vld,
  eh,
  e2p,
  autoTo,
  palNm,
  extractThemeColors,
  extractColors,
  extractFonts,
  extractShapesFromZip,
  applyFontRunProps,
  applyShapeOps,
  applyShapeFillLine,
  applyShapePresets,
  applyLayoutToXml,
  doLayoutAnalysis
} from '../../scripts/pptx-analyzer';
import {
  Upload,
  Settings,
  FolderOpen,
  ArrowRight,
  RefreshCw,
  Palette,
  Type,
  Maximize2,
  FileCheck,
  Download,
  AlertTriangle,
  Info,
  CheckCircle,
  FolderSync,
  Layers,
  Trash2,
  Plus,
  Image as ImageIcon,
  ChevronRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Recommended 11 fonts list
const FONT_PRESETS = [
  'Pretendard',
  'Pretendard SemiBold',
  'Pretendard Bold',
  'SUIT',
  'Wanted Sans',
  'Paperlogy',
  'Gmarket Sans',
  'Gmarket Sans Bold',
  'LINE Seed KR',
  'Spoqa Han Sans Neo',
  'Noto Sans KR',
  'IBM Plex Sans KR',
  'NanumSquare Neo',
  'Sunghyun Sans',
  '맑은 고딕',
  'Malgun Gothic',
  '나눔고딕',
  '함초롬돋움',
  'Arial',
  'Calibri',
  'Segoe UI',
  'Times New Roman'
];

const DEFAULT_PALETTE = [
  { hex: '002060', name: 'NIPA 진한 네이비' },
  { hex: '073167', name: 'NIPA 다크 블루' },
  { hex: '1E4785', name: 'NIPA 중간 네이비' },
  { hex: '1575E9', name: 'NIPA 기본 파랑' },
  { hex: '2789F5', name: 'NIPA 밝은 파랑' },
  { hex: '4F6D90', name: 'NIPA 스틸블루' },
  { hex: '5B9BD5', name: 'NIPA 연한 파랑' },
  { hex: '23ABDE', name: 'NIPA 하늘색' },
  { hex: '02B0C2', name: 'NIPA 청록' },
  { hex: '0DB364', name: 'NIPA 초록' }
];

const DEFAULT_LAYOUT = [
  { id: 'title', label: '타이틀', color: '#2563eb', x: 36, y: 21, w: 648, h: 90, active: true, source: 'NIPA 기본값' },
  { id: 'chapter', label: '챕터명', color: '#7c3aed', x: 36, y: 14, w: 286, h: 21, active: true, source: 'NIPA 기본값' },
  { id: 'body', label: '본문', color: '#16a34a', x: 36, y: 125, w: 648, h: 280, active: true, source: 'NIPA 기본값' },
  { id: 'pageNum', label: '페이지번호', color: '#ea580c', x: 680, y: 388, w: 50, h: 18, active: false, source: 'NIPA 기본값' },
  { id: 'logo', label: '로고(일반)', color: '#0d9488', x: 620, y: 14, w: 90, h: 28, active: false, source: '사용자 등록' },
  { id: 'logoBg', label: '로고(배경)', color: '#9333ea', x: 210, y: 120, w: 300, h: 165, active: false, source: '사용자 등록' }
];

const DEFAULT_FONT_MAPPINGS = [
  { id: 'f1', from: 'Paperlogy 4', to: 'Pretendard', active: true, note: 'Paperlogy Light → Pretendard' },
  { id: 'f2', from: 'Paperlogy 5', to: 'Pretendard', active: true, note: 'Paperlogy Regular → Pretendard' },
  { id: 'f3', from: 'Paperlogy 6', to: 'Pretendard', active: true, note: 'Paperlogy SemiBold → Pretendard' },
  { id: 'f4', from: 'Paperlogy 7', to: 'Pretendard Bold', active: true, note: 'Paperlogy Bold → Pretendard Bold' },
  { id: 'f5', from: 'Paperlogy 8', to: 'Pretendard ExtraBold', active: false, note: 'Paperlogy ExtraBold' },
  { id: 'f6', from: 'Paperlogy 9', to: 'Pretendard Bold', active: false, note: 'Paperlogy Black' },
  { id: 'f7', from: 'Paperlogy', to: 'Pretendard', active: true, note: 'Paperlogy 기본 (번호 없음)' }
];

const KEEP = new Set([
  'FFFFFF', 'FEFEFE', 'FCFCFC', 'F8F8F8', 'F5F5F5', '000000', '010101',
  'F0F0F0', 'EEEEEE', 'FAFAFA', 'E7E6E6', 'EDEDED', 'D9D9D9'
]);

const GEOM_CSS: Record<string, { br?: string; cp?: string }> = {
  ellipse: { br: '50%' }, oval: { br: '50%' },
  roundRect: { br: '5px' }, round1Rect: { br: '5px' }, round2SameRect: { br: '5px' }, round2DiagRect: { br: '5px' }, snip1Rect: { br: '0' },
  triangle: { cp: 'polygon(50% 0, 100% 100%, 0 100%)' },
  rtTriangle: { cp: 'polygon(0 0, 0 100%, 100% 100%)' },
  diamond: { cp: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)' },
  pentagon: { cp: 'polygon(50% 0, 100% 38%, 82% 100%, 18% 100%, 0 38%)' },
  homePlate: { cp: 'polygon(0 0, 70% 0, 100% 50%, 70% 100%, 0 100%)' },
  chevron: { cp: 'polygon(0 0, 70% 0, 100% 50%, 70% 100%, 0 100%, 30% 50%)' },
  hexagon: { cp: 'polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)' },
  octagon: { cp: 'polygon(30% 0, 70% 0, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%, 0 30%)' },
  parallelogram: { cp: 'polygon(20% 0, 100% 0, 80% 100%, 0 100%)' },
  trapezoid: { cp: 'polygon(20% 0, 80% 0, 100% 100%, 0 100%)' },
  rightArrow: { cp: 'polygon(0 25%, 60% 25%, 60% 0, 100% 50%, 60% 100%, 60% 75%, 0 75%)' },
  leftArrow: { cp: 'polygon(40% 0, 40% 25%, 100% 25%, 100% 75%, 40% 75%, 40% 100%, 0 50%)' },
  star5: { cp: 'polygon(50% 0, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' },
  star4: { cp: 'polygon(50% 0, 60% 40%, 100% 50%, 60% 60%, 50% 100%, 40% 60%, 0 50%, 40% 40%)' },
  heart: { cp: 'polygon(50% 100%, 15% 60%, 15% 25%, 50% 35%, 85% 25%, 85% 60%)' },
  ellipseRibbon: { br: '0' },
};

function resolveShapeColor(c: string, themeColors: Record<string, string>) {
  if (!c) return null;
  if (vld(c)) return '#' + c;
  const alias: Record<string, string> = { bg1: 'lt1', tx1: 'dk1', bg2: 'lt2', tx2: 'dk2' };
  const key = alias[c] || c;
  if (themeColors[key] && vld(themeColors[key])) return '#' + themeColors[key];
  return null;
}

export default function PptxAnalyzer() {
  const { toast } = useToast();

  // Top level tabs: 'baseline' (Module A) | 'convert' (Module B)
  const [mainTab, setMainTab] = useState<'baseline' | 'convert'>('baseline');
  
  // Sub-tabs in baseline (Module A) mode: 'color' | 'layout' | 'font' | 'logo'
  const [baseSubTab, setBaseSubTab] = useState<'color' | 'layout' | 'font'>('color');
  
  // Sub-tabs in convert (Module B) mode: 'clr' | 'fnt' | 'lyt' | 'shp'
  const [convertSubTab, setConvertSubTab] = useState<'clr' | 'fnt' | 'lyt' | 'shp'>('clr');

  const [isLoading, setIsLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');

  // --- STATE FOR MODULE A: BASELINE ---
  const [rawFileName, setRawFileName] = useState('내장 기본값 (PPTX 없이 설정값만)');
  const [rawSlidesCount, setRawSlidesCount] = useState(0);
  const [showRawInfo, setShowRawInfo] = useState(false);
  const [slideCx, setSlideCx] = useState(9144000); // 10 inches in EMUs (default 720pt)
  const [slideCy, setSlideCy] = useState(5143500); // 5.625 inches in EMUs (default 405pt)
  
  const [v2Palette, setV2Palette] = useState<any[]>(() => {
    const saved = localStorage.getItem('v2_baseline_palette');
    return saved ? JSON.parse(saved) : DEFAULT_PALETTE.map(p => ({ ...p }));
  });
  const [v2LayoutRules, setV2LayoutRules] = useState<any[]>(() => {
    const saved = localStorage.getItem('v2_baseline_layout');
    return saved ? JSON.parse(saved) : DEFAULT_LAYOUT.map(l => ({ ...l }));
  });
  const [v2FontMappings, setV2FontMappings] = useState<any[]>(() => {
    const saved = localStorage.getItem('v2_baseline_fonts');
    return saved ? JSON.parse(saved) : DEFAULT_FONT_MAPPINGS.map(m => ({ ...m }));
  });
  const [logos, setLogos] = useState<{ normal: string | null; bg: string | null }>(() => {
    const saved = localStorage.getItem('v2_baseline_logos');
    return saved ? JSON.parse(saved) : { normal: null, bg: null };
  });
  const [layoutPresets, setLayoutPresets] = useState<any[]>(() => {
    const saved = localStorage.getItem('v2_baseline_presets');
    return saved ? JSON.parse(saved) : [];
  });

  // Detected stats in baseline PPTX
  const [rawDetectedColors, setRawDetectedColors] = useState<Record<string, any>>({});
  const [rawSchemeColors, setRawSchemeColors] = useState<Record<string, number>>({});
  const [rawFontsDetected, setRawFontsDetected] = useState<Record<string, any>>({});

  // --- STATE FOR MODULE B: TARGET CONVERSION ---
  const [tgtFileName, setTgtFileName] = useState('');
  const [tgtFileBuf, setTgtFileBuf] = useState<ArrayBuffer | null>(null);
  const [tgtZip, setTgtZip] = useState<JSZip | null>(null);
  const [tgtColorCount, setTgtColorCount] = useState(0);
  const [tgtFontCount, setTgtFontCount] = useState(0);
  const [tgtSlideCount, setTgtSlideCount] = useState(0);

  // Target parsed elements
  const [tgtColors, setTgtColors] = useState<Record<string, any>>({});
  const [tgtScheme, setTgtScheme] = useState<Record<string, number>>({});
  const [tgtThemeMap, setTgtThemeMap] = useState<Record<string, string>>({});
  const [tgtFonts, setTgtFonts] = useState<Record<string, any>>({});
  const [tgtShapes, setTgtShapes] = useState<any[]>([]);

  // Conversion Mappings
  const [colorMappings, setColorMappings] = useState<any[]>([]);
  const [selectedColorIdx, setSelectedColorIdx] = useState<number>(-1);
  const [fontMappings, setFontMappings] = useState<any[]>([]);
  const [layoutScope, setLayoutScope] = useState<'slides' | 'all'>('slides');
  const [shapeOps, setShapeOps] = useState({
    removeShadow: false,
    removeGlow: false,
    flattenGradient: false,
    removeOutline: false
  });
  const [fillLine, setFillLine] = useState({
    fillColorOn: false,
    fillColor: '#1E4785',
    fillAlphaOn: false,
    fillAlpha: 100,
    lineColorOn: false,
    lineColor: '#002060',
    lineAlphaOn: false,
    lineAlpha: 100,
    lineWidthOn: false,
    lineWidth: 1
  });
  const [shapePresets, setShapePresets] = useState<any[]>([]);
  const [activePresetsMap, setActivePresetsMap] = useState<Record<string, string>>({});

  // JSON View and Step Control
  const [isJsonView, setIsJsonView] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [convertStep, setConvertStep] = useState<1 | 2 | 3 | 4>(1); // 1: Upload target, 2: Mapping, 3: Review, 4: Done

  // Result output
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [convSummary, setConvSummary] = useState<any>({});

  const baselineInputRef = useRef<HTMLInputElement>(null);
  const targetInputRef = useRef<HTMLInputElement>(null);

  // Auto-save baseline configs locally
  useEffect(() => {
    localStorage.setItem('v2_baseline_palette', JSON.stringify(v2Palette));
  }, [v2Palette]);

  useEffect(() => {
    localStorage.setItem('v2_baseline_layout', JSON.stringify(v2LayoutRules));
  }, [v2LayoutRules]);

  useEffect(() => {
    localStorage.setItem('v2_baseline_fonts', JSON.stringify(v2FontMappings));
  }, [v2FontMappings]);

  useEffect(() => {
    localStorage.setItem('v2_baseline_logos', JSON.stringify(logos));
  }, [logos]);

  useEffect(() => {
    localStorage.setItem('v2_baseline_presets', JSON.stringify(layoutPresets));
  }, [layoutPresets]);

  // --- BASELINE UPLOAD & ANALYSIS (Module A) ---
  const handleBaselineFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processBaselineFile(e.target.files[0]);
    }
  };

  const processBaselineFile = async (file: File) => {
    if (!/\.pptx$/i.test(file.name)) {
      alert('.pptx 파일만 분석할 수 있습니다.');
      return;
    }
    setIsLoading(true);
    setLoadingMsg('기준 파워포인트 XML 구조 분석 중...');
    setRawFileName(file.name);

    try {
      const buf = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(buf);

      // Slide size
      let cx = 9144000;
      let cy = 5143500;
      if (zip.files['ppt/presentation.xml']) {
        const px = await zip.files['ppt/presentation.xml'].async('string');
        const cm = px.match(/sldSz cx="(\d+)" cy="(\d+)"/);
        if (cm) {
          cx = parseInt(cm[1]);
          cy = parseInt(cm[2]);
        }
      }
      setSlideCx(cx);
      setSlideCy(cy);

      const slides = Object.keys(zip.files).filter(k => /^ppt\/slides\/slide\d+\.xml$/.test(k)).length;
      setRawSlidesCount(slides);

      // Colors
      const { det, sch } = await extractColors(zip);
      setRawDetectedColors(det);
      setRawSchemeColors(sch);

      const detected = Object.entries(det)
        .sort((a: any, b: any) => b[1].count - a[1].count)
        .filter(([h]) => !KEEP.has(h));

      if (detected.length && confirm('기준 PPTX에서 감지된 주요 색상으로 기준 팔레트를 업데이트할까요?')) {
        const updatedPal = detected.slice(0, 12).map(([h]) => ({
          hex: h,
          name: palNm(h, v2Palette) || FROM_NM[h] || h
        }));
        setV2Palette(updatedPal);
      }

      // Layout placeholder analysis
      const updatedLayout = await doLayoutAnalysis(zip, v2LayoutRules);
      setV2LayoutRules(updatedLayout);

      // Fonts
      const rawF = await extractFonts(zip);
      setRawFontsDetected(rawF);

      const updatedFonts = Object.keys(rawF).map((fName, index) => {
        const matched = v2FontMappings.find(m => m.from === fName);
        return {
          id: 'rf' + index,
          from: fName,
          to: matched ? matched.to : 'Pretendard',
          active: true,
          note: matched ? matched.note : '감지됨'
        };
      });
      setV2FontMappings(updatedFonts);
      setShowRawInfo(true);
      
      toast({
        title: "기준 분석 성공",
        description: `슬라이드 ${slides}장, 색상 ${Object.keys(det).length}종, 서체 ${Object.keys(rawF).length}종을 성공적으로 이식했습니다.`,
      });
    } catch (err: any) {
      alert(`오류: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const resetBaselineToDefaults = () => {
    if (confirm('기준 설정을 내장 기본 NIPA 규격으로 초기화할까요?')) {
      setV2Palette(DEFAULT_PALETTE.map(p => ({ ...p })));
      setV2LayoutRules(DEFAULT_LAYOUT.map(l => ({ ...l })));
      setV2FontMappings(DEFAULT_FONT_MAPPINGS.map(m => ({ ...m })));
      setLogos({ normal: null, bg: null });
      setLayoutPresets([]);
      setSlideCx(9144000);
      setSlideCy(5143500);
      setRawFileName('내장 기본값 (PPTX 없이 설정값만)');
      setShowRawInfo(false);
      
      localStorage.removeItem('v2_baseline_palette');
      localStorage.removeItem('v2_baseline_layout');
      localStorage.removeItem('v2_baseline_fonts');
      localStorage.removeItem('v2_baseline_logos');
      localStorage.removeItem('v2_baseline_presets');
      
      toast({
        title: "기준 초기화 완료",
        description: "모든 기준 설계 데이터가 기본 NIPA 명세로 롤백되었습니다.",
      });
    }
  };

  // Baseline Editing triggers
  const handleUpdateBaseColor = (index: number, field: 'hex' | 'name', val: string) => {
    const updated = [...v2Palette];
    if (field === 'hex') {
      updated[index].hex = val.replace('#', '').toUpperCase();
    } else {
      updated[index].name = val;
    }
    setV2Palette(updated);
  };

  const handleAddBaseColor = () => {
    setV2Palette([...v2Palette, { hex: '888888', name: '새 색상' }]);
  };

  const handleDeleteBaseColor = (index: number) => {
    if (v2Palette.length <= 2) {
      alert('최소 2개 이상의 색상이 필요합니다.');
      return;
    }
    const updated = [...v2Palette];
    updated.splice(index, 1);
    setV2Palette(updated);
  };

  // Baseline Layout Presets
  const handleSaveLayoutPreset = () => {
    const def = `프리셋 ${layoutPresets.length + 1}`;
    const name = prompt('이 위치 구성을 저장할 프리셋 명칭을 입력하세요:', def);
    if (name === null) return;
    setLayoutPresets([...layoutPresets, {
      id: 'L' + Date.now(),
      name: name || def,
      rules: v2LayoutRules.map(r => ({ id: r.id, x: r.x, y: r.y, w: r.w, h: r.h, active: r.active }))
    }]);
  };

  const handleApplyLayoutPreset = (id: string) => {
    const preset = layoutPresets.find(p => p.id === id);
    if (!preset) return;
    const updated = v2LayoutRules.map(r => {
      const match = preset.rules.find((pr: any) => pr.id === r.id);
      return match ? { ...r, x: match.x, y: match.y, w: match.w, h: match.h, active: match.active } : r;
    });
    setV2LayoutRules(updated);
  };

  const handleDeleteLayoutPreset = (id: string) => {
    setLayoutPresets(layoutPresets.filter(p => p.id !== id));
  };

  // Baseline Logo Registration
  const handleLogoUpload = (key: 'normal' | 'bg', e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    if (!/^image\//.test(file.type)) {
      alert('이미지 파일만 등록할 수 있습니다.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setLogos(prev => ({ ...prev, [key]: reader.result as string }));
      // Auto active logo rule
      const ruleId = key === 'normal' ? 'logo' : 'logoBg';
      const updated = v2LayoutRules.map(r => r.id === ruleId ? { ...r, active: true } : r);
      setV2LayoutRules(updated);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Baseline Font Editing
  const handleUpdateBaseFont = (index: number, field: 'from' | 'to' | 'note', val: string) => {
    const updated = [...v2FontMappings];
    updated[index][field] = val;
    setV2FontMappings(updated);
  };

  const handleToggleBaseFontActive = (index: number, active: boolean) => {
    const updated = [...v2FontMappings];
    updated[index].active = active;
    setV2FontMappings(updated);
  };

  const handleAddBaseFont = () => {
    setV2FontMappings([...v2FontMappings, {
      id: 'f' + Date.now(),
      from: '',
      to: 'Pretendard',
      active: true,
      note: '추가됨'
    }]);
  };

  const handleDeleteBaseFont = (index: number) => {
    const updated = [...v2FontMappings];
    updated.splice(index, 1);
    setV2FontMappings(updated);
  };

  // Baseline JSON Download/Upload
  const handleDownloadBaselineJson = (type: 'colors' | 'layout' | 'fonts') => {
    let data: any = {};
    let filename = '';
    if (type === 'colors') {
      data = { name: 'V2 Colors Baseline', palette: v2Palette };
      filename = 'colors_baseline.json';
    } else if (type === 'layout') {
      data = { name: 'V2 Layout Baseline', slideSizePt: { w: Math.round(e2p(slideCx)), h: Math.round(e2p(slideCy)) }, elements: v2LayoutRules, presets: layoutPresets };
      filename = 'layout_baseline.json';
    } else {
      data = { name: 'V2 Fonts Baseline', mappings: v2FontMappings };
      filename = 'fonts_baseline.json';
    }
    trigDl(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), filename);
  };

  const handleUploadBaselineJson = (type: 'colors' | 'layout' | 'fonts', e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target?.result as string);
        if (type === 'colors') {
          const arr = parsed.palette || parsed;
          if (Array.isArray(arr)) {
            setV2Palette(arr.map(p => ({ hex: String(p.hex || p).replace('#', '').toUpperCase(), name: p.name || '' })));
          }
        } else if (type === 'layout') {
          const arr = parsed.elements || parsed;
          if (Array.isArray(arr)) {
            setV2LayoutRules(arr);
          }
          if (Array.isArray(parsed.presets)) {
            setLayoutPresets(parsed.presets);
          }
        } else {
          const arr = parsed.mappings || parsed;
          if (Array.isArray(arr)) {
            setV2FontMappings(arr.map((m, idx) => ({ id: 'f' + idx, from: m.from || '', to: m.to || 'Pretendard', active: m.active !== false, note: m.note || '' })));
          }
        }
        toast({ title: "기준 파일 이식 성공", description: `${file.name} 명세가 로드되었습니다.` });
      } catch (err: any) {
        alert(`파싱 실패: ${err.message}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };


  // --- TARGET UPLOAD & CONVERSION (Module B) ---
  const handleTargetFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processTargetFile(e.target.files[0]);
    }
  };

  const processTargetFile = async (file: File) => {
    setIsLoading(true);
    setLoadingMsg('Target PPTX 파일 XML 해독 중...');
    setTgtFileName(file.name);

    try {
      const buf = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(buf);

      setTgtFileBuf(buf);
      setTgtZip(zip);

      const themeCol = await extractThemeColors(zip);
      setTgtThemeMap(themeCol);

      const { det, sch } = await extractColors(zip);
      setTgtColors(det);
      setTgtScheme(sch);
      setTgtColorCount(Object.keys(det).length);

      const fonts = await extractFonts(zip);
      setTgtFonts(fonts);
      setTgtFontCount(Object.keys(fonts).length);

      const shapes = await extractShapesFromZip(zip);
      setTgtShapes(shapes);

      const slides = Object.keys(zip.files).filter(k => /^ppt\/slides\/slide\d+\.xml$/.test(k)).length;
      setTgtSlideCount(slides);

      // Map target colors to the CURRENT configured v2Palette
      const paletteHexes = v2Palette.map(p => p.hex);
      const mappings = Object.entries(det)
        .sort((a: any, b: any) => b[1].count - a[1].count)
        .map(([hex, details]: [string, any]) => {
          const toColor = autoTo(hex, paletteHexes);
          const hasTheme = themeCol && Object.values(themeCol).includes(hex);
          let themeRole = '';
          if (hasTheme) {
            themeRole = Object.keys(themeCol).find(k => themeCol[k] === hex) || '';
          }
          return {
            from: hex,
            fromName: FROM_NM[hex] || (themeRole ? `Theme: ${themeRole}` : 'Detected'),
            to: toColor,
            toName: palNm(toColor, v2Palette) || '',
            active: !KEEP.has(hex) && toColor !== hex,
            count: details.count,
            fill: details.fill,
            line: details.line,
            effect: details.effect,
            gradient: details.gradient
          };
        });

      setColorMappings(mappings);

      // Map target fonts to the CURRENT configured v2FontMappings
      const fMappings = Object.entries(fonts)
        .sort((a: any, b: any) => b[1].count - a[1].count)
        .map(([fontName, details]: [string, any], index) => {
          const baseMap = v2FontMappings.find(m => m.active && m.from.toLowerCase() === fontName.toLowerCase());
          const toFont = baseMap ? baseMap.to : '';
          return {
            id: 'bf' + index,
            from: fontName,
            to: toFont,
            count: details.count,
            active: !!(toFont && toFont !== fontName),
            inSlides: details.inSlides,
            inMasters: details.inMasters,
            boldMode: 'keep',
            sizeScale: 1
          };
        });

      setFontMappings(fMappings);
      setConvertStep(2);
    } catch (err: any) {
      alert(`오류: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteTargetConversion = async () => {
    if (!tgtZip || !tgtFileBuf) return;
    setIsLoading(true);
    setLoadingMsg('XML 치환 엔진 가동 중 (색상·글꼴·도형·위치)...');

    try {
      const zip = await JSZip.loadAsync(tgtFileBuf);

      const activeClr = colorMappings.filter(m => m.active && vld(m.to) && m.from !== m.to);
      const activeFnt = fontMappings.filter(m => m.active && m.from && m.to && m.from !== m.to);
      const runFnt = fontMappings.filter(m => m.active && ((m.sizeScale && m.sizeScale !== 1) || (m.boldMode && m.boldMode !== 'keep')));
      const activeLyt = v2LayoutRules.filter(r => r.active);
      const ops = shapeOps;
      const anyOp = ops.removeShadow || ops.removeGlow || ops.flattenGradient || ops.removeOutline;
      const fl = fillLine;
      const anyFL = fl.fillColorOn || fl.fillAlphaOn || fl.lineColorOn || fl.lineAlphaOn || fl.lineWidthOn;

      const presetAssignsBySlide: Record<number, Record<string, string>> = {};
      tgtShapes.forEach(s => {
        const pId = activePresetsMap[s.uid];
        if (pId) {
          if (!presetAssignsBySlide[s.slide]) {
            presetAssignsBySlide[s.slide] = {};
          }
          presetAssignsBySlide[s.slide][s.spId] = pId;
        }
      });

      let filesModified = 0;
      let clrSwapsCount = 0;
      let fntSwapsCount = 0;
      let fontSzSwapsCount = 0;
      let fontBldSwapsCount = 0;
      let shpSwapsCount = 0;
      let lytSwapsCount = 0;
      let presetSwapsCount = 0;
      let flFillSwapsCount = 0;
      let flLineSwapsCount = 0;

      for (const k of Object.keys(zip.files)) {
        const f = zip.files[k];
        if (f.dir || !k.endsWith('.xml')) continue;

        let txt = await f.async('string');
        let isChanged = false;

        const isSlide = /^ppt\/slides\/slide\d+\.xml$/.test(k);
        const isMasterLayout = /slideLayout|slideMaster/.test(k);

        // 1. Font run size/bold
        if (runFnt.length && (isSlide || isMasterLayout)) {
          const res = applyFontRunProps(txt, runFnt);
          if (res.sz || res.bold) {
            txt = res.txt;
            fontSzSwapsCount += res.sz;
            fontBldSwapsCount += res.bold;
            isChanged = true;
          }
        }

        // 2. Shape filter ops
        if (anyOp && (isSlide || isMasterLayout)) {
          const res = applyShapeOps(txt, ops);
          if (res.count) {
            txt = res.txt;
            shpSwapsCount += res.count;
            isChanged = true;
          }
        }

        // 3. Shape Fill & Line adjustments
        if (anyFL && (isSlide || isMasterLayout)) {
          const res = applyShapeFillLine(txt, fl);
          if (res.fillN || res.lineN) {
            txt = res.txt;
            flFillSwapsCount += res.fillN;
            flLineSwapsCount += res.lineN;
            isChanged = true;
          }
        }

        // 4. Shape Preset apply (per-shape, slide level)
        if (isSlide) {
          const sMatch = k.match(/slide(\d+)\.xml/);
          const slideNum = sMatch ? parseInt(sMatch[1]) : -1;
          const slideAssigns = presetAssignsBySlide[slideNum];
          if (slideAssigns) {
            const res = applyShapePresets(txt, slideAssigns, shapePresets);
            if (res.count) {
              txt = res.txt;
              presetSwapsCount += res.count;
              isChanged = true;
            }
          }
        }

        // 5. Global color mapping (based on the CUSTOM BASELINE configured)
        for (const m of activeClr) {
          const re = new RegExp('((?:srgbClr val|lastClr)=")' + m.from + '(")', 'gi');
          const hits = (txt.match(re) || []).length;
          if (hits) {
            txt = txt.replace(re, '$1' + m.to.toUpperCase() + '$2');
            clrSwapsCount += hits;
            isChanged = true;
          }
        }

        // 6. Global font mappings
        for (const m of activeFnt) {
          const escaped = m.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const re = new RegExp('(typeface=")' + escaped + '(")', 'g');
          const hits = (txt.match(re) || []).length;
          if (hits) {
            txt = txt.replace(re, '$1' + m.to + '$2');
            fntSwapsCount += hits;
            isChanged = true;
          }
        }

        // 7. Global layout custom baseline position rules
        if (activeLyt.length) {
          const inScope = isSlide || (layoutScope === 'all' && isMasterLayout);
          if (inScope) {
            const res = applyLayoutToXml(txt, activeLyt);
            if (res.count) {
              txt = res.txt;
              lytSwapsCount += res.count;
              isChanged = true;
            }
          }
        }

        if (isChanged) {
          zip.file(k, txt);
          filesModified++;
        }
      }

      setLoadingMsg('바이너리 합산 패키징 중...');
      const outBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      });

      const outName = `${tgtFileName.replace(/\.pptx$/i, '')}_변환_v2.pptx`;
      setResultBlob(outBlob);

      setConvSummary({
        filesCount: filesModified,
        colorSwaps: clrSwapsCount,
        fontSwaps: fntSwapsCount,
        sizeSwaps: fontSzSwapsCount,
        boldSwaps: fontBldSwapsCount,
        shapeSwaps: shpSwapsCount,
        layoutSwaps: lytSwapsCount,
        fillSwaps: flFillSwapsCount,
        lineSwaps: flLineSwapsCount,
        presetSwaps: presetSwapsCount,
        outFileName: outName
      });

      trigDl(outBlob, outName);
      setConvertStep(4);
    } catch (err: any) {
      alert(`치환 컴파일 실패: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Level Module Switcher (Module A / Module B) */}
      <div className="flex bg-white p-1 rounded-xl border border-slate-200 w-full md:w-fit">
        <button
          onClick={() => setMainTab('baseline')}
          className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 justify-center ${
            mainTab === 'baseline'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="h-4 w-4" /> ⚙️ Module A — 기준 설정
        </button>
        <button
          onClick={() => setMainTab('convert')}
          className={`flex-1 md:flex-none px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 justify-center ${
            mainTab === 'convert'
              ? 'bg-blue-600 text-white shadow'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ArrowRight className="h-4 w-4 animate-pulse" /> ▶ Module B — 변환 실행
        </button>
      </div>

      {/* --- MODULE A: BASELINE WORKSPACE --- */}
      {mainTab === 'baseline' && (
        <div className="space-y-6">
          {/* Baseline File Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
              <div>
                <div className="text-xs text-slate-500">현재 디자인 기준 (Baseline Source)</div>
                <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">{rawFileName}</div>
              </div>
            </div>

            <div className="flex gap-2 text-xs">
              <label className="bg-slate-50 hover:bg-slate-850 border border-slate-200 text-slate-350 hover:text-white px-3 py-2 rounded-lg cursor-pointer transition-all flex items-center gap-1.5">
                <FolderOpen className="h-3.5 w-3.5" /> 기준 PPTX 업로드
                <input
                  type="file"
                  ref={baselineInputRef}
                  onChange={handleBaselineFileChange}
                  accept=".pptx"
                  className="hidden"
                />
              </label>
              <button
                onClick={resetBaselineToDefaults}
                className="bg-slate-50 hover:bg-slate-850 border border-slate-200 text-slate-350 hover:text-white px-3 py-2 rounded-lg transition-all flex items-center gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" /> 기준 초기화
              </button>
            </div>
          </div>

          {/* Baseline Sub-navigation */}
          <div className="flex gap-2 border-b border-slate-200 pb-px">
            <button
              onClick={() => setBaseSubTab('color')}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-all ${
                baseSubTab === 'color'
                  ? 'border-blue-500 text-white font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              🎨 색상 기준 설정
            </button>
            <button
              onClick={() => setBaseSubTab('layout')}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-all ${
                baseSubTab === 'layout'
                  ? 'border-blue-500 text-white font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              📐 위치·크기 기준 설정
            </button>
            <button
              onClick={() => setBaseSubTab('font')}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-all ${
                baseSubTab === 'font'
                  ? 'border-blue-500 text-white font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              🔤 폰트 기준 설정
            </button>
          </div>

          {/* Sub-tab 1: Color Baseline */}
          {baseSubTab === 'color' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">🎨 기준 색상 팔레트 편집</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Target PPTX의 색상을 이식할 목표 팔레트 명세입니다. 직접 편집하거나 기준 PPTX를 올려 자동 갱신할 수 있습니다.
                  </p>
                </div>
                <div className="flex gap-2 text-xs">
                  <button
                    onClick={handleAddBaseColor}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                  >
                    +색상 추가
                  </button>
                  <button
                    onClick={() => handleDownloadBaselineJson('colors')}
                    className="bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                  >
                    💾 colors_baseline.json 저장
                  </button>
                  <label className="bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded flex items-center gap-1 cursor-pointer transition-colors">
                    📥 불러오기
                    <input
                      type="file"
                      onChange={(e) => handleUploadBaselineJson('colors', e)}
                      accept=".json"
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Baseline colors grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {v2Palette.map((p, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex flex-col gap-2 relative group">
                    <button
                      onClick={() => handleDeleteBaseColor(i)}
                      className="absolute top-2 right-2 text-slate-650 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={`#${p.hex}`}
                        onChange={(e) => handleUpdateBaseColor(i, 'hex', e.target.value)}
                        className="w-7 h-7 p-0 bg-transparent border-0 cursor-pointer shrink-0 rounded"
                      />
                      <input
                        type="text"
                        value={p.hex}
                        maxLength={6}
                        onChange={(e) => handleUpdateBaseColor(i, 'hex', e.target.value)}
                        className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-center text-xs font-mono text-slate-700 w-16"
                      />
                    </div>
                    <input
                      type="text"
                      value={p.name}
                      placeholder="색상 이름"
                      onChange={(e) => handleUpdateBaseColor(i, 'name', e.target.value)}
                      className="bg-transparent border-0 border-b border-transparent hover:border-slate-200 focus:border-blue-500 focus:outline-none text-[11px] text-slate-500 py-0.5"
                    />
                  </div>
                ))}
              </div>

              {/* Baseline PPTX detected colors (if loaded) */}
              {showRawInfo && Object.keys(rawDetectedColors).length > 0 && (
                <div className="border-t border-slate-200 pt-6 space-y-3">
                  <h5 className="text-xs font-bold text-slate-350">📊 업로드된 기준 PPTX 내부 감지 색상 목록</h5>
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                    {Object.entries(rawDetectedColors).slice(0, 36).map(([hex, d]: [string, any]) => (
                      <div key={hex} className="bg-slate-50/40 border border-slate-200/60 p-2.5 rounded-lg flex items-center gap-2">
                        <div className="w-5 h-5 rounded border border-slate-950 shrink-0" style={{ backgroundColor: `#${hex}` }} />
                        <div className="min-w-0">
                          <div className="text-[10px] text-slate-700 font-mono">#{hex}</div>
                          <div className="text-[9px] text-slate-500">{d.count}회 감지</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sub-tab 2: Layout Baseline */}
          {baseSubTab === 'layout' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">📐 위치·크기 기준 설계 매니저</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    숏코드 및 메우개가 가져갈 기준 픽셀(pt) 좌표입니다. 우측에서 가로/세로 레이아웃 배치를 확인하세요.
                  </p>
                </div>
                <div className="flex gap-2 text-xs">
                  <button
                    onClick={handleSaveLayoutPreset}
                    className="bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                  >
                    현재 구성 프리셋으로 저장
                  </button>
                  <button
                    onClick={() => handleDownloadBaselineJson('layout')}
                    className="bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                  >
                    💾 layout_baseline.json 저장
                  </button>
                  <label className="bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded flex items-center gap-1 cursor-pointer transition-colors">
                    📥 불러오기
                    <input
                      type="file"
                      onChange={(e) => handleUploadBaselineJson('layout', e)}
                      accept=".json"
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Preset Chips */}
              {layoutPresets.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 bg-slate-50/30 border border-slate-200 p-2 rounded-lg text-xs">
                  <span className="text-slate-500 font-medium">저장된 프리셋:</span>
                  {layoutPresets.map(p => (
                    <span key={p.id} className="inline-flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px]">
                      <button onClick={() => handleApplyLayoutPreset(p.id)} className="text-blue-400 font-bold hover:text-blue-300">
                        {p.name}
                      </button>
                      <button onClick={() => handleDeleteLayoutPreset(p.id)} className="text-slate-600 hover:text-red-400 ml-1">✕</button>
                    </span>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Rules Table */}
                <div className="xl:col-span-8 overflow-x-auto border border-slate-200 rounded-lg bg-slate-50/10 text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-white sticky top-0 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                      <tr>
                        <th className="p-3 w-12 text-center">적용</th>
                        <th className="p-3">요소 구분</th>
                        <th className="p-3 text-center">X (pt)</th>
                        <th className="p-3 text-center">Y (pt)</th>
                        <th className="p-3 text-center">W (pt)</th>
                        <th className="p-3 text-center">H (pt)</th>
                        <th className="p-3">출처</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60">
                      {v2LayoutRules.map((r, idx) => (
                        <tr key={idx} className={`hover:bg-slate-50/30 ${!r.active ? 'opacity-40' : ''}`}>
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              checked={r.active}
                              onChange={(e) => {
                                const updated = [...v2LayoutRules];
                                updated[idx].active = e.target.checked;
                                setV2LayoutRules(updated);
                              }}
                              className="rounded border-slate-200 bg-slate-50 text-blue-600 accent-blue-500"
                            />
                          </td>
                          <td className="p-3">
                            <span 
                              className="px-2 py-0.5 rounded text-[10px] font-semibold border"
                              style={{ backgroundColor: r.color + '15', color: r.color, borderColor: r.color + '30' }}
                            >
                              {r.label}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <input
                              type="number"
                              value={r.x}
                              onChange={(e) => handleUpdateLayoutValue(idx, 'x', parseInt(e.target.value) || 0)}
                              className="w-16 bg-white border border-slate-200 rounded px-1.5 py-0.5 text-center text-xs font-mono"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <input
                              type="number"
                              value={r.y}
                              onChange={(e) => handleUpdateLayoutValue(idx, 'y', parseInt(e.target.value) || 0)}
                              className="w-16 bg-white border border-slate-200 rounded px-1.5 py-0.5 text-center text-xs font-mono"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <input
                              type="number"
                              value={r.w}
                              onChange={(e) => handleUpdateLayoutValue(idx, 'w', parseInt(e.target.value) || 0)}
                              className="w-16 bg-white border border-slate-200 rounded px-1.5 py-0.5 text-center text-xs font-mono"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <input
                              type="number"
                              value={r.h}
                              onChange={(e) => handleUpdateLayoutValue(idx, 'h', parseInt(e.target.value) || 0)}
                              className="w-16 bg-white border border-slate-200 rounded px-1.5 py-0.5 text-center text-xs font-mono"
                            />
                          </td>
                          <td className="p-3 text-slate-500 font-mono text-[10px]">
                            {r.source}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 16:9 Canvas preview */}
                <div className="xl:col-span-4 bg-slate-50/20 border border-slate-200 p-4 rounded-xl flex flex-col justify-between">
                  <div className="text-[11px] text-slate-500 font-semibold mb-2">물리 앵커 실시간 시각화</div>
                  <div className="relative w-full aspect-[16/9] bg-white border border-slate-200 rounded overflow-hidden">
                    {v2LayoutRules.map((l, i) => {
                      if (!l.active) return null;
                      const wp = e2p(slideCx);
                      const hp = e2p(slideCy);
                      const wRatio = (l.w / wp) * 100;
                      const hRatio = (l.h / hp) * 100;
                      const xRatio = (l.x / wp) * 100;
                      const yRatio = (l.y / hp) * 100;

                      const logoImg = l.id === 'logo' ? logos.normal : (l.id === 'logoBg' ? logos.bg : null);

                      return (
                        <div
                          key={i}
                          className="absolute flex items-center justify-center text-[7px] font-bold border"
                          style={{
                            left: `${xRatio}%`,
                            top: `${yRatio}%`,
                            width: `${wRatio}%`,
                            height: `${hRatio}%`,
                            backgroundColor: l.color + '25',
                            borderColor: l.color,
                            color: l.color
                          }}
                        >
                          {logoImg ? (
                            <img src={logoImg} className="max-w-full max-h-full object-contain" />
                          ) : (
                            <span className="scale-75 bg-white/80 px-1 py-0.5 rounded">{l.label}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Logo uploads */}
                  <div className="grid grid-cols-2 gap-2 mt-4 text-[10px]">
                    <div className="border border-slate-200 p-2 rounded bg-white space-y-1">
                      <div className="font-semibold text-slate-700">일반 로고 (코너)</div>
                      <label className="block bg-slate-50 hover:bg-slate-850 border border-slate-200 px-2 py-1 rounded text-center cursor-pointer text-slate-500">
                        파일 업로드
                        <input type="file" onChange={(e) => handleLogoUpload('normal', e)} className="hidden" />
                      </label>
                      {logos.normal && (
                        <button onClick={() => setLogos(prev => ({ ...prev, normal: null }))} className="text-red-400 w-full text-center block hover:underline">
                          제거
                        </button>
                      )}
                    </div>

                    <div className="border border-slate-200 p-2 rounded bg-white space-y-1">
                      <div className="font-semibold text-slate-700">배경 로고 (워터마크)</div>
                      <label className="block bg-slate-50 hover:bg-slate-850 border border-slate-200 px-2 py-1 rounded text-center cursor-pointer text-slate-500">
                        파일 업로드
                        <input type="file" onChange={(e) => handleLogoUpload('bg', e)} className="hidden" />
                      </label>
                      {logos.bg && (
                        <button onClick={() => setLogos(prev => ({ ...prev, bg: null }))} className="text-red-400 w-full text-center block hover:underline">
                          제거
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-tab 3: Font Baseline */}
          {baseSubTab === 'font' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">🔤 기준 글꼴(Font) 패밀리 매핑 편집</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    문서 변환기 구동 시, 원본에 지정된 서체를 교체할 기준 글꼴 관계 명세서입니다.
                  </p>
                </div>
                <div className="flex gap-2 text-xs">
                  <button
                    onClick={handleAddBaseFont}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                  >
                    +폰트 매핑 추가
                  </button>
                  <button
                    onClick={() => handleDownloadBaselineJson('fonts')}
                    className="bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                  >
                    💾 fonts_baseline.json 저장
                  </button>
                  <label className="bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded flex items-center gap-1 cursor-pointer transition-colors">
                    📥 불러오기
                    <input
                      type="file"
                      onChange={(e) => handleUploadBaselineJson('fonts', e)}
                      accept=".json"
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Fonts Mapping Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-lg bg-slate-50/10 text-xs">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-white sticky top-0 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3 w-12 text-center">변환</th>
                      <th className="p-3">원본 서체명 (From)</th>
                      <th className="p-3 w-8"></th>
                      <th className="p-3">목표 서체명 (To)</th>
                      <th className="p-3">메모 / 설명</th>
                      <th className="p-3 w-12">제거</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/60">
                    {v2FontMappings.map((m, idx) => (
                      <tr key={idx} className={`hover:bg-slate-50/30 ${!m.active ? 'opacity-40' : ''}`}>
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={m.active}
                            onChange={(e) => handleToggleBaseFontActive(idx, e.target.checked)}
                            className="rounded border-slate-200 bg-slate-50 text-blue-600 accent-blue-500"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="text"
                            value={m.from}
                            onChange={(e) => handleUpdateBaseFont(idx, 'from', e.target.value)}
                            placeholder="예: NanumSquare"
                            className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-800 font-mono text-xs w-full max-w-[200px]"
                          />
                        </td>
                        <td className="p-3 text-slate-500 font-bold text-center">→</td>
                        <td className="p-3">
                          <select
                            value={m.to}
                            onChange={(e) => handleUpdateBaseFont(idx, 'to', e.target.value)}
                            className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-800 text-xs w-full max-w-[200px]"
                          >
                            {FONT_PRESETS.map(f => (
                              <option key={f} value={f}>{f}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-3">
                          <input
                            type="text"
                            value={m.note || ''}
                            onChange={(e) => handleUpdateBaseFont(idx, 'note', e.target.value)}
                            placeholder="설명 메모"
                            className="bg-white border border-slate-200 rounded px-2 py-1 text-slate-800 text-xs w-full"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDeleteBaseFont(idx)}
                            className="text-slate-600 hover:text-red-400"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Baseline PPTX detected fonts list */}
              {showRawInfo && Object.keys(rawFontsDetected).length > 0 && (
                <div className="border-t border-slate-200 pt-6 space-y-3">
                  <h5 className="text-xs font-bold text-slate-350">📊 업로드된 기준 PPTX 내부 감지 서체 목록</h5>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(rawFontsDetected).map(([fName, d]: [string, any]) => {
                      const matched = v2FontMappings.find(m => m.from === fName);
                      return (
                        <div key={fName} className="bg-slate-50/40 border border-slate-200 p-2.5 rounded-lg text-xs">
                          <strong className="text-slate-800 font-mono block">{fName}</strong>
                          <span className="text-[10px] text-slate-500 block mt-0.5">{d.count}회 사용</span>
                          {matched && matched.active ? (
                            <span className="text-[9px] text-emerald-400 mt-1 block">✓ 매핑 완료 ({matched.to})</span>
                          ) : (
                            <span className="text-[9px] text-yellow-500/80 mt-1 block">미등록 매핑</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}


      {/* --- MODULE B: TARGET CONVERSION WORKSPACE --- */}
      {mainTab === 'convert' && (
        <div className="space-y-6">
          {/* Target File Upload dropzone (Step 1) */}
          {convertStep === 1 && (
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xl">
              <div
                onClick={() => targetInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 bg-slate-50/30 hover:border-slate-700 hover:bg-slate-50/50 rounded-xl p-16 flex flex-col items-center justify-center cursor-pointer transition-all duration-200"
              >
                <input
                  type="file"
                  ref={targetInputRef}
                  onChange={handleTargetFileChange}
                  accept=".pptx"
                  className="hidden"
                />
                {isLoading ? (
                  <div className="text-center space-y-4">
                    <RefreshCw className="h-12 w-12 text-blue-500 animate-spin mx-auto" />
                    <p className="text-slate-700 font-medium text-xs">{loadingMsg}</p>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="h-16 w-16 bg-slate-850 border border-slate-700/50 rounded-2xl flex items-center justify-center mx-auto text-3xl">
                      📂
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-1">변환할 Target PPTX 파일 올리기</h3>
                      <p className="text-slate-500 text-xs max-w-sm mx-auto">
                        디자인 변환 대상 파일을 로드하여 기준 설정(Module A) 규격으로 이식시킵니다.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Target Conversion details (Step 2) */}
          {convertStep === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Category tabs */}
              <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-4 h-fit space-y-2">
                <div className="text-slate-500 text-[10px] uppercase font-bold tracking-wider px-3 mb-2">대상 맵핑 카테고리</div>
                <button
                  onClick={() => setConvertSubTab('clr')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between text-xs font-semibold transition-all ${
                    convertSubTab === 'clr' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    <span>색상 치환</span>
                  </div>
                  <span className="text-[10px] bg-slate-50 px-2 py-0.5 rounded-full">{tgtColorCount}색</span>
                </button>
                <button
                  onClick={() => setConvertSubTab('fnt')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between text-xs font-semibold transition-all ${
                    convertSubTab === 'fnt' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    <span>글꼴 및 크기 치환</span>
                  </div>
                  <span className="text-[10px] bg-slate-50 px-2 py-0.5 rounded-full">{tgtFontCount}종</span>
                </button>
                <button
                  onClick={() => setConvertSubTab('lyt')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between text-xs font-semibold transition-all ${
                    convertSubTab === 'lyt' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Maximize2 className="h-4 w-4" />
                    <span>위치·크기 이식</span>
                  </div>
                </button>
                <button
                  onClick={() => setConvertSubTab('shp')}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between text-xs font-semibold transition-all ${
                    convertSubTab === 'shp' ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    <span>도형 효과 프리셋</span>
                  </div>
                  <span className="text-[10px] bg-slate-50 px-2 py-0.5 rounded-full">{tgtShapes.length}개</span>
                </button>

                <div className="pt-4 border-t border-slate-200 mt-4 space-y-2">
                  <button
                    onClick={() => setConvertStep(3)}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1 transition-colors"
                  >
                    다음 단계 검토 <ChevronRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setConvertStep(1)}
                    className="w-full border border-slate-200 text-slate-500 hover:text-slate-700 text-xs py-2 rounded-lg transition-colors"
                  >
                    다른 파일 선택
                  </button>
                </div>
              </div>

              {/* Sub-workspace panels */}
              <div className="lg:col-span-9 space-y-6">
                {/* Target Color Mapping Workspace */}
                {convertSubTab === 'clr' && (
                  <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">🎨 색상 치환 설정</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Target PPTX 색상들을 기준 설정(Module A)에서 정의한 색상 팔레트로 매핑합니다.
                        </p>
                      </div>
                      <div className="flex gap-1.5 text-xs">
                        <button
                          onClick={handleDownloadMappingJson}
                          className="bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
                        >
                          💾 mapping.json 저장
                        </button>
                        <label className="bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded flex items-center gap-1 cursor-pointer transition-colors">
                          📥 불러오기
                          <input type="file" onChange={handleUploadMappingJson} accept=".json" className="hidden" />
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                      {/* Mapping Table */}
                      <div className="xl:col-span-8 overflow-y-auto max-h-[420px] border border-slate-200 rounded-lg text-xs">
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-white sticky top-0 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                            <tr>
                              <th className="p-3 w-12 text-center">변환</th>
                              <th className="p-3">감지 원본 색상 (Target)</th>
                              <th className="p-3 w-8"></th>
                              <th className="p-3">치환 목표 색상 (Baseline)</th>
                              <th className="p-3 text-center">감지 횟수</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200/50">
                            {colorMappings.map((m, idx) => (
                              <tr
                                key={idx}
                                onClick={() => setSelectedColorIdx(idx)}
                                className={`hover:bg-slate-50/40 cursor-pointer ${
                                  selectedColorIdx === idx ? 'bg-blue-600/10' : ''
                                } ${!m.active ? 'opacity-40' : ''}`}
                              >
                                <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                                  <input
                                    type="checkbox"
                                    checked={m.active}
                                    onChange={(e) => handleToggleColorActive(idx, e.target.checked)}
                                    className="rounded border-slate-200 bg-slate-50 text-blue-600 accent-blue-500"
                                  />
                                </td>
                                <td className="p-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded border border-slate-950 shrink-0" style={{ backgroundColor: `#${m.from}` }} />
                                    <div>
                                      <div className="font-mono text-slate-350">#{m.from}</div>
                                      <div className="text-[9px] text-slate-500">{m.fromName}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-3 text-slate-500 font-bold text-center">→</td>
                                <td className="p-3" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded border border-slate-950 shrink-0" style={{ backgroundColor: `#${m.to || '888888'}` }} />
                                    <input
                                      type="color"
                                      value={`#${m.to || '888888'}`}
                                      onChange={(e) => handleUpdateToColor(idx, e.target.value)}
                                      className="w-6 h-6 p-0 bg-transparent border-0 cursor-pointer"
                                    />
                                    <input
                                      type="text"
                                      value={m.to}
                                      maxLength={6}
                                      onChange={(e) => handleUpdateToColor(idx, e.target.value)}
                                      className="w-16 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-center text-xs font-mono text-slate-700"
                                    />
                                  </div>
                                </td>
                                <td className="p-3 text-center text-slate-500 font-mono">{m.count}회</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Baseline palettes quick inject */}
                      <div className="xl:col-span-4 bg-slate-50/20 border border-slate-200 p-4 rounded-xl space-y-3">
                        <div className="text-[11px] font-bold text-slate-700">🎨 V2.0 커스텀 기준 팔레트 주입</div>
                        <p className="text-[10px] text-slate-500">
                          테이블에서 치환하려는 색상 행을 클릭한 다음, 아래 기준 색상을 선택하면 매핑 값이 즉시 바뀝니다.
                        </p>
                        {selectedColorIdx >= 0 ? (
                          <div className="bg-white border border-slate-200 p-2 rounded text-[10px] text-slate-500">
                            선택 행: <strong className="text-blue-400">#{colorMappings[selectedColorIdx]?.from}</strong> →{' '}
                            <strong className="text-indigo-400">#{colorMappings[selectedColorIdx]?.to}</strong>
                          </div>
                        ) : (
                          <div className="text-[9px] text-yellow-500 bg-yellow-500/5 p-2 rounded border border-yellow-500/10">
                            ※ 색상 주입을 위해 매핑 테이블 행을 선택하세요.
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-2">
                          {v2Palette.map((p, i) => (
                            <button
                              key={i}
                              disabled={selectedColorIdx < 0}
                              onClick={() => applyPaletteToSelected(p.hex, p.name)}
                              className="bg-white hover:border-blue-500 border border-slate-200 rounded p-1.5 text-left text-[10px] flex items-center gap-1.5 w-full disabled:opacity-40"
                            >
                              <div className="w-4 h-4 rounded shrink-0 border border-slate-200" style={{ backgroundColor: `#${p.hex}` }} />
                              <div className="min-w-0">
                                <div className="font-bold text-slate-800 truncate">{p.name}</div>
                                <div className="text-[9px] text-slate-500 font-mono">#{p.hex}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Target Font Mapping Workspace */}
                {convertSubTab === 'fnt' && (
                  <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">🔤 글꼴(Font) 패밀리 매핑 및 크기 조율</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Target 파일 내부의typeface 서체를 기준 명세 글꼴로 자동 매핑합니다.
                      </p>
                    </div>

                    <div className="overflow-x-auto border border-slate-200 rounded-lg text-xs">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-white sticky top-0 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                          <tr>
                            <th className="p-3 w-12 text-center">변환</th>
                            <th className="p-3">감지 원본 글꼴 (Target)</th>
                            <th className="p-3 w-6"></th>
                            <th className="p-3">치환 목표 글꼴 (Baseline)</th>
                            <th className="p-3 text-center">굵기</th>
                            <th className="p-3 text-center">크기 배수</th>
                            <th className="p-3 text-center">사용 횟수</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/50">
                          {fontMappings.map((m, idx) => (
                            <tr key={idx} className={`hover:bg-slate-50/40 ${!m.active ? 'opacity-40' : ''}`}>
                              <td className="p-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={m.active}
                                  onChange={(e) => handleToggleFontActive(idx, e.target.checked)}
                                  className="rounded border-slate-200 bg-slate-50 text-blue-600 accent-blue-500"
                                />
                              </td>
                              <td className="p-3">
                                <div className="font-mono text-slate-800">{m.from}</div>
                                <div className="text-[9px] text-slate-500">{[m.inSlides && '슬라이드', m.inMasters && '마스터'].filter(Boolean).join(' / ')}</div>
                              </td>
                              <td className="p-3 text-slate-500 font-bold text-center">→</td>
                              <td className="p-3">
                                <select
                                  value={m.to}
                                  onChange={(e) => handleUpdateToFont(idx, e.target.value)}
                                  className="bg-slate-905 border border-slate-200 rounded px-2 py-1 text-slate-700 w-full max-w-[180px]"
                                >
                                  <option value="">(변환 안 함 - 원본 유지)</option>
                                  {FONT_PRESETS.map(f => (
                                    <option key={f} value={f}>{f}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="p-3 text-center">
                                <select
                                  value={m.boldMode}
                                  onChange={(e) => handleUpdateFontBold(idx, e.target.value)}
                                  className="bg-slate-905 border border-slate-200 rounded px-1.5 py-1 text-slate-350 text-[11px]"
                                >
                                  <option value="keep">유지</option>
                                  <option value="on">굵게</option>
                                  <option value="off">보통</option>
                                </select>
                              </td>
                              <td className="p-3 text-center">
                                <select
                                  value={m.sizeScale.toString()}
                                  onChange={(e) => handleUpdateFontSize(idx, parseFloat(e.target.value))}
                                  className="bg-slate-905 border border-slate-200 rounded px-1.5 py-1 text-slate-355 text-[11px]"
                                >
                                  <option value="1">유지</option>
                                  <option value="0.9">×0.9</option>
                                  <option value="0.95">×0.95</option>
                                  <option value="1.05">×1.05</option>
                                  <option value="1.1">×1.1</option>
                                </select>
                              </td>
                              <td className="p-3 text-center font-mono text-slate-500">{m.count}회</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Target Layout Mapping Workspace */}
                {convertSubTab === 'lyt' && (
                  <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">📐 위치·크기 변환</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        기준 설정(Module A)에서 정의한 물리 규격 좌표를 Target 슬라이드 메우개(Placeholder)에 이식합니다.
                      </p>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-50/50 p-2 rounded-lg text-xs w-fit">
                      <span className="text-slate-500 font-semibold">적용 슬라이드 범위:</span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setLayoutScope('slides')}
                          className={`px-3 py-1 rounded transition-all font-medium ${
                            layoutScope === 'slides' ? 'bg-blue-600 text-white' : 'text-slate-450 hover:text-slate-800'
                          }`}
                        >
                          슬라이드 개체만
                        </button>
                        <button
                          onClick={() => setLayoutScope('all')}
                          className={`px-3 py-1 rounded transition-all font-medium ${
                            layoutScope === 'all' ? 'bg-blue-600 text-white' : 'text-slate-455 hover:text-slate-800'
                          }`}
                        >
                          마스터/레이아웃 전체 포함
                        </button>
                      </div>
                    </div>

                    <div className="overflow-x-auto border border-slate-200 rounded-lg text-xs">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-white sticky top-0 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                          <tr>
                            <th className="p-3 w-12 text-center">적용</th>
                            <th className="p-3">요소 구분</th>
                            <th className="p-3 text-right">X (pt)</th>
                            <th className="p-3 text-right">Y (pt)</th>
                            <th className="p-3 text-right">W (pt)</th>
                            <th className="p-3 text-right">H (pt)</th>
                            <th className="p-3">매칭 대상</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/50">
                          {v2LayoutRules.map((l, i) => (
                            <tr key={i} className={`hover:bg-slate-50/40 ${!l.active ? 'opacity-40' : ''}`}>
                              <td className="p-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={l.active}
                                  disabled={true} // Controlled by baseline tab
                                  className="rounded border-slate-200 bg-slate-50 text-blue-600 accent-blue-500"
                                />
                              </td>
                              <td className="p-3">
                                <span
                                  className="px-2 py-0.5 rounded text-[10px] font-semibold border"
                                  style={{ backgroundColor: l.color + '15', color: l.color, borderColor: l.color + '30' }}
                                >
                                  {l.label}
                                </span>
                              </td>
                              <td className="p-3 text-right font-mono text-slate-350">{l.x}</td>
                              <td className="p-3 text-right font-mono text-slate-350">{l.y}</td>
                              <td className="p-3 text-right font-mono text-slate-350">{l.w}</td>
                              <td className="p-3 text-right font-mono text-slate-350">{l.h}</td>
                              <td className="p-3 text-slate-500 font-mono text-[10px]">
                                {l.id === 'title' ? 'title / ctrTitle' : l.id === 'chapter' ? 'subTitle / body idx1' : l.id === 'body' ? 'body / obj idx>=2' : l.id === 'pageNum' ? 'sldNum' : 'Custom'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Target Shape Conversion Workspace */}
                {convertSubTab === 'shp' && (
                  <div className="space-y-6">
                    {/* Filters and adjustments */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                      <div className="border-b border-slate-200 pb-3">
                        <h4 className="text-xs font-bold text-slate-900">🔷 도형 효과 필터 및 일괄 변환</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          도형들의 불필요한 그림자/글로우 제거, 단색 채우기 평탄화 및 테두리 두께 조정을 지원합니다.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border border-slate-200/80 bg-slate-50/10 rounded-lg p-4 space-y-3">
                          <div className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-1.5 flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4 text-orange-500" /> 일괄 효과 제거 필터
                          </div>
                          <div className="space-y-2 text-xs">
                            <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={shapeOps.removeShadow}
                                onChange={() => handleToggleShapeOp('removeShadow')}
                                className="rounded border-slate-200 bg-white text-blue-600 accent-blue-500"
                              />
                              도형 그림자 일괄 제거
                            </label>
                            <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={shapeOps.removeGlow}
                                onChange={() => handleToggleShapeOp('removeGlow')}
                                className="rounded border-slate-200 bg-white text-blue-600 accent-blue-500"
                              />
                              도형 글로우(Neon) 일괄 제거
                            </label>
                            <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={shapeOps.flattenGradient}
                                onChange={() => handleToggleShapeOp('flattenGradient')}
                                className="rounded border-slate-200 bg-white text-blue-600 accent-blue-500"
                              />
                              그라데이션 채우기 → 단색 일괄 변환
                            </label>
                            <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={shapeOps.removeOutline}
                                onChange={() => handleToggleShapeOp('removeOutline')}
                                className="rounded border-slate-200 bg-white text-blue-600 accent-blue-500"
                              />
                              도형 테두리선(Outline) 일괄 제거
                            </label>
                          </div>
                        </div>

                        <div className="border border-slate-200/80 bg-slate-50/10 rounded-lg p-4 space-y-3">
                          <div className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-1.5 flex items-center gap-1">
                            <Palette className="h-4 w-4 text-blue-500" /> 채우기 / 윤곽선 일괄 색·두께 지정
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-[11px]">
                            {/* Fill options */}
                            <div className="space-y-2 border-r border-slate-200 pr-2">
                              <div className="font-semibold text-slate-700">채우기 (Fill)</div>
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={fillLine.fillColorOn}
                                  onChange={(e) => handleUpdateFillLine('fillColorOn', e.target.checked)}
                                />
                                <span>색 지정</span>
                              </label>
                              {fillLine.fillColorOn && (
                                <input
                                  type="color"
                                  value={fillLine.fillColor}
                                  onChange={(e) => handleUpdateFillLine('fillColor', e.target.value)}
                                  className="w-5 h-5 rounded cursor-pointer p-0 border border-slate-200 bg-slate-50"
                                />
                              )}
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={fillLine.fillAlphaOn}
                                  onChange={(e) => handleUpdateFillLine('fillAlphaOn', e.target.checked)}
                                />
                                <span>투명도 ({fillLine.fillAlpha}%)</span>
                              </label>
                              {fillLine.fillAlphaOn && (
                                <input
                                  type="range"
                                  min={0}
                                  max={100}
                                  value={fillLine.fillAlpha}
                                  onChange={(e) => handleUpdateFillLine('fillAlpha', parseInt(e.target.value))}
                                  className="w-full accent-blue-500"
                                />
                              )}
                            </div>

                            {/* Outline options */}
                            <div className="space-y-2">
                              <div className="font-semibold text-slate-700">윤곽선 (Line)</div>
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={fillLine.lineColorOn}
                                  onChange={(e) => handleUpdateFillLine('lineColorOn', e.target.checked)}
                                />
                                <span>색 지정</span>
                              </label>
                              {fillLine.lineColorOn && (
                                <input
                                  type="color"
                                  value={fillLine.lineColor}
                                  onChange={(e) => handleUpdateFillLine('lineColor', e.target.value)}
                                  className="w-5 h-5 rounded cursor-pointer p-0 border border-slate-200 bg-slate-50"
                                />
                              )}
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={fillLine.lineWidthOn}
                                  onChange={(e) => handleUpdateFillLine('lineWidthOn', e.target.checked)}
                                />
                                <span>두께 ({fillLine.lineWidth}pt)</span>
                              </label>
                              {fillLine.lineWidthOn && (
                                <input
                                  type="number"
                                  step="0.25"
                                  value={fillLine.lineWidth}
                                  onChange={(e) => handleUpdateFillLine('lineWidth', parseFloat(e.target.value) || 0)}
                                  className="w-12 bg-slate-50 border border-slate-200 rounded px-1 text-center"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Standard preset registration */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <FolderSync className="h-4 w-4 text-yellow-500" /> 표준 효과 프리셋 (도형 이식)
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          특정 도형의 그림자, 글로우, 선 스타일을 표준 효과 프리셋으로 저장하여 전역 배포 적용시킵니다.
                        </p>
                      </div>

                      {shapePresets.length === 0 ? (
                        <div className="text-slate-500 text-xs py-4 text-center border border-dashed border-slate-200 rounded-lg">
                          등록된 표준 프리셋이 없습니다. 아래 슬라이드별 도형 목록에서 [+표준] 버튼을 눌러 등록하세요.
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-3">
                          {shapePresets.map(p => {
                            const cnt = Object.values(activePresetsMap).filter(v => v === p.id).length;
                            return (
                              <div key={p.id} className="bg-slate-50 border border-yellow-500/20 rounded-lg p-3 space-y-2 min-w-[180px]">
                                <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                                  <span className="text-xs font-bold text-yellow-500">{p.name}</span>
                                  <button onClick={() => deletePreset(p.id)} className="text-slate-500 hover:text-red-400">
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                                <div className="text-[10px] text-slate-500">슬라이드 S{p.srcSlide} · {p.srcName}</div>
                                <div className="text-[10px] text-slate-500">선택 적용: <strong>{cnt}개</strong> 도형</div>
                                <div className="flex gap-1 pt-1">
                                  <button onClick={() => assignPresetToShapesWithEffects(p.id)} className="bg-indigo-600/80 hover:bg-indigo-600 text-white text-[9px] font-semibold px-2 py-0.5 rounded transition-colors">
                                    효과 있는 도형에 전부
                                  </button>
                                  <button onClick={() => assignPresetToAll(p.id)} className="border border-slate-700 text-slate-700 text-[9px] font-semibold px-2 py-0.5 rounded transition-colors">
                                    전부
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                          <div className="flex items-end">
                            <button onClick={clearAllPresetsAssignments} className="border border-slate-200 hover:border-slate-700 text-slate-500 hover:text-slate-700 text-xs px-3 py-1 rounded transition-colors">
                              할당 해제
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Shapes list */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5">
                      <div className="text-slate-450 text-xs mb-3">도형 상세 분석 리스트 ({tgtShapes.length}개)</div>
                      <div className="max-h-[350px] overflow-y-auto border border-slate-200 rounded-lg text-xs">
                        <table className="w-full text-left border-collapse">
                          <thead className="bg-white sticky top-0 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px] tracking-wider">
                            <tr>
                              <th className="p-3 w-16 text-center">슬라이드</th>
                              <th className="p-3">도형명</th>
                              <th className="p-3 text-center">미리보기</th>
                              <th className="p-3">도형 유형</th>
                              <th className="p-3">그림자/글로우</th>
                              <th className="p-3 text-center">표준 등록</th>
                              <th className="p-3">프리셋 적용</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200/50">
                            {tgtShapes.map((s, i) => (
                              <tr key={i} className={`hover:bg-slate-50/40 ${activePresetsMap[s.uid] ? 'bg-yellow-500/5' : ''}`}>
                                <td className="p-3 text-center text-blue-400 font-bold">S{s.slide}</td>
                                <td className="p-3 text-slate-800 font-semibold truncate max-w-[120px]" title={s.name}>{s.name}</td>
                                <td className="p-3 text-center">{renderShapeThumb(s)}</td>
                                <td className="p-3 text-slate-500 truncate max-w-[100px]">{s.geom || '—'}</td>
                                <td className="p-3">
                                  {s.effects?.shadow || s.effects?.glow ? (
                                    <span className="bg-blue-900/40 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/10 text-[10px]">
                                      효과 있음
                                    </span>
                                  ) : (
                                    <span className="text-slate-600">—</span>
                                  )}
                                </td>
                                <td className="p-3 text-center">
                                  <button onClick={() => registerShapeAsPreset(s.uid)} className="bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/20 rounded px-2 py-0.5 text-[10px] font-semibold transition-colors">
                                    +등록
                                  </button>
                                </td>
                                <td className="p-3">
                                  <select
                                    value={activePresetsMap[s.uid] || ''}
                                    onChange={(e) => assignPresetToShape(s.uid, e.target.value)}
                                    className="bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-[11px]"
                                  >
                                    <option value="">선택 안함</option>
                                    {shapePresets.map(p => (
                                      <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                  </select>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Target review and compile (Step 3) */}
          {convertStep === 3 && (
            <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xl space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-blue-500" /> 디자인 이식 요약 검토
                </h3>
                <p className="text-slate-500 text-xs mt-0.5">
                  최종 PPTX 생성 전, 치환 설정을 점검하십시오.
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="bg-slate-50/50 border border-slate-200 p-4 rounded-xl">
                  <div className="text-slate-500 uppercase font-bold tracking-wider text-[10px]">색상 치환 종류</div>
                  <div className="text-xl font-bold text-blue-400 mt-1">
                    {colorMappings.filter(m => m.active && m.from !== m.to).length} 색
                  </div>
                </div>
                <div className="bg-slate-50/50 border border-slate-200 p-4 rounded-xl">
                  <div className="text-slate-500 uppercase font-bold tracking-wider text-[10px]">글꼴 치환 종류</div>
                  <div className="text-xl font-bold text-indigo-400 mt-1">
                    {fontMappings.filter(m => m.active).length} 종
                  </div>
                </div>
                <div className="bg-slate-50/50 border border-slate-200 p-4 rounded-xl">
                  <div className="text-slate-500 uppercase font-bold tracking-wider text-[10px]">위치 이식 정보</div>
                  <div className="text-xl font-bold text-emerald-400 mt-1">
                    {v2LayoutRules.filter(l => l.active).length} 개 원등
                  </div>
                </div>
                <div className="bg-slate-50/50 border border-slate-200 p-4 rounded-xl">
                  <div className="text-slate-500 uppercase font-bold tracking-wider text-[10px]">도형 이식 프리셋</div>
                  <div className="text-xl font-bold text-orange-400 mt-1">
                    {Object.keys(activePresetsMap).length} 개 도형
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6 flex gap-3">
                <button
                  onClick={handleExecuteTargetConversion}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      <span>변환 중...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5" />
                      <span>기준 테마 이식 실행 및 다운로드</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setConvertStep(2)}
                  className="border border-slate-200 text-slate-500 hover:text-slate-800 font-semibold py-3 px-6 rounded-xl transition-all"
                >
                  이전 단계 수정
                </button>
              </div>
            </div>
          )}

          {/* Success compilation (Step 4) */}
          {convertStep === 4 && (
            <div className="bg-white border border-slate-200 rounded-xl p-12 shadow-xl text-center space-y-6 max-w-xl mx-auto">
              <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center text-4xl mx-auto shadow-lg">
                ✓
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">파워포인트 변환 생성 완료!</h3>
                <p className="text-slate-500 text-xs">
                  기준 설정(Module A) 규격이 완벽하게 이식되어 다운로드 폴더에 보관되었습니다.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-left divide-y divide-slate-200/50 space-y-2">
                <div className="pb-2 text-slate-500">
                  출력 파일명: <strong className="text-slate-800 font-mono block mt-1">{convSummary.outFileName}</strong>
                </div>
                <div className="pt-2 grid grid-cols-2 gap-y-2 text-slate-305">
                  <div>수정된 압축 요소: <strong>{convSummary.filesCount}개 XML</strong></div>
                  <div>색상 치환: <strong>{convSummary.colorSwaps}곳</strong></div>
                  <div>글꼴 치환: <strong>{convSummary.fontSwaps}곳</strong></div>
                  <div>글꼴 크기 조율: <strong>{convSummary.sizeSwaps}곳</strong></div>
                  <div>글꼴 굵기 교정: <strong>{convSummary.boldSwaps}곳</strong></div>
                  <div>레이아웃 교정: <strong>{convSummary.layoutSwaps}곳</strong></div>
                </div>
              </div>

              <div className="flex gap-3 justify-center pt-4">
                {resultBlob && (
                  <button
                    onClick={() => trigDl(resultBlob, convSummary.outFileName)}
                    className="bg-emerald-650 hover:bg-emerald-600 text-white font-semibold py-2 px-5 rounded-lg text-xs transition-colors"
                  >
                    다시 다운로드
                  </button>
                )}
                <button
                  onClick={() => {
                    setConvertStep(1);
                    setTgtFileName('');
                    setTgtFileBuf(null);
                    setTgtZip(null);
                    setResultBlob(null);
                    setActivePresetsMap({});
                  }}
                  className="border border-slate-200 text-slate-500 hover:text-slate-800 font-semibold py-2 px-5 rounded-lg text-xs transition-colors"
                >
                  새로운 파일 변환
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
