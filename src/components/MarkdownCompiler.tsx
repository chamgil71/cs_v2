import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  RefreshCw, 
  Loader2, 
  Monitor, 
  Tablet, 
  Smartphone,
  Save
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Relative Luminance for WCAG Contrast
function getLuminance(hex: string): number {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6) return 0;
  const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
  const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
  const b = parseInt(cleanHex.slice(4, 6), 16) / 255;
  const a = [r, g, b].map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function getContrast(hex1: string, hex2: string): number {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

export default function MarkdownCompiler() {
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Markdown editor states
  const [markdown, setMarkdown] = useState<string>(`---
title: 새 가이드 문서 V2.0
subtitle: V2.0 컴파일러를 통해 HTML 및 PPTX를 생성합니다
style: custom-blue
---

# 🚀 새로운 기능 소개

이곳에 가이드 내용을 작성하세요.

## 📋 핵심 요약

- **서버리스 아키텍처**: 브라우저 단독 컴파일 지원
- **디자인 격리**: V1.0 영향도 0%

---
<!-- slide -->
# 💡 숏코드 테스트

::: editor-box dev_env (javascript)
### 🛠️ 개발 환경 설정
- **OS**: Windows / macOS / Linux 지원
- **Runtime**: Node.js v18 이상 권장
:::
`);
  const [filename, setFilename] = useState("guide_v2.md");

  // Insert shortcode at cursor position
  const insertShortcode = (type: string) => {
    if (!type) return;
    let snippet = "";
    switch (type) {
      case "editor-box":
        snippet = `\n::: editor-box\n- title: "filename.js"\n  tag: "javascript"\n  desc: |\n    // 코드 내용\n    console.log("Hello, World!");\n:::\n`;
        break;
      case "compare-split":
        snippet = `\n::: compare-split\n- title: "Before"\n  desc: "기존 수동 렌더링"\n  meta: "수동 HTML 태그 관리 | 스타일 일관성 부족"\n- title: "After"\n  desc: "V2 자동 숏코드"\n  meta: "마크다운 기반 시각화 | 동적 높이 및 일관성"\n:::\n`;
        break;
      case "compare-diff":
        snippet = `\n::: compare-diff\n- title: "AS-IS 구형 코드"\n  desc: "legacyCode()"\n- title: "TO-BE 신규 코드"\n  desc: "modernCode()"\n:::\n`;
        break;
      case "compare-grid":
        snippet = `\n::: compare-grid\n- title: "구분 1"\n  desc: "설명 1"\n- title: "구분 2"\n  desc: "설명 2"\n:::\n`;
        break;
      case "network-box":
        snippet = `\n::: network-box\n- title: "중앙 핵심 개념"\n  color: "#EC4899"\n- title: "연결 개념 A"\n  meta: "세부 관계"\n- title: "연결 개념 B"\n  meta: "세부 관계"\n:::\n`;
        break;
      case "stat-grid":
        snippet = `\n::: stat-grid\n- icon: "99.9%"\n  title: "가동 시간"\n  desc: "평균 가동률"\n- icon: "120ms"\n  title: "응답 지연"\n  desc: "API 응답 지연"\n:::\n`;
        break;
      case "git-flow":
        snippet = `\n::: git-flow\n- title: "main"\n  tag: "v2.0.0"\n  meta: "초기 버전 | 패치 배포"\n  color: "#10B981"\n- title: "dev"\n  tag: "develop"\n  meta: "신규 기능 추가 | 버그 수정"\n  color: "#3B82F6"\n:::\n`;
        break;
      case "alert-box":
        snippet = `\n::: alert-box tip\n- title: "작성 팁"\n  desc: "기본 본문은 desc 속성 하위에서 작성해 주세요."\n:::\n`;
        break;
      case "tool-list":
        snippet = `\n::: tool-list\n- icon: "🛠️"\n  title: "Vite"\n  desc: "초고속 프론트엔드 빌드 도구"\n  meta: "HMR 지원 | 플러그인 생태계"\n:::\n`;
        break;
      case "plan-grid":
        snippet = `\n::: plan-grid\n- title: "Basic Plan"\n  tag: "Free"\n  meta: "기본 기능 제공 | 일간 10회 컴파일"\n- title: "Premium Plan"\n  tag: "Best"\n  meta: "모든 숏코드 지원 | 무제한 빌드 및 익스포트"\n  featured: "true"\n  color: "#3B82F6"\n:::\n`;
        break;
      case "icon-grid":
        snippet = `\n::: icon-grid cols=3 bullet=✔️\n- icon: "🚀"\n  title: "빠른 퍼포먼스"\n  desc: "최적화된 빌드와 빌트인 파서 탑재"\n- icon: "🎨"\n  title: "디자인 테마 선택"\n  desc: "다양한 테마 조합 가능"\n:::\n`;
        break;
      case "feature-grid":
        snippet = `\n::: feature-grid cols=2\n- icon: "⚡"\n  title: "실시간 미리보기"\n  desc: "수정 즉시 빌드 결과를 반영합니다."\n  tag: "핵심"\n- icon: "📦"\n  title: "일괄 변환 기능"\n  desc: "전체 폴더를 원클릭으로 변환합니다."\n  tag: "실무"\n:::\n`;
        break;
      case "step-list":
        snippet = `\n::: step-list\n- title: "문서 선택"\n  desc: "가이드 문서를 로드하거나 새로 작성합니다."\n- title: "숏코드 편집"\n  desc: "필요한 시각화 숏코드를 삽입하고 옵션을 조절합니다."\n:::\n`;
        break;
      case "columns-grid":
        snippet = `\n::: columns-grid cols=2\n- title: "HTML Guide"\n  desc: "가로 다단 형태의 깔끔한 가이드 북 레이아웃"\n  meta: "독립 실행 HTML 파일"\n- title: "16:9 Slides"\n  desc: "발표 및 스크린 공유를 위한 와이드 슬라이드 레이아웃"\n  meta: "프레젠테이션 최적화"\n:::\n`;
        break;
      case "workflow-flow":
        snippet = `\n::: workflow-flow\n- icon: "✏️"\n  title: "마크다운 작성"\n  meta: "에디터 사용"\n- icon: "⚙️"\n  title: "V2 컴파일"\n  meta: "백엔드 변환"\n:::\n`;
        break;
      case "summary-box":
        snippet = `\n::: summary-box\n- title: "요약정리"\n  desc: "시각화 숏코드를 활용하면 핵심 개념을 직관적으로 전달할 수 있습니다."\n  meta: "21종 숏코드 | HTML 연동 | PPTX 연동"\n:::\n`;
        break;
      case "faq-list":
        snippet = `\n::: faq-list\n- title: "Q. 숏코드가 정상적으로 렌더링되지 않아요."\n  desc: "A. 숏코드 내부 인덴트(여백)나 문법이 V2 규격(::: 숏코드명)과 일치하는지 확인하십시오."\n:::\n`;
        break;
      case "console-box":
        snippet = `\n::: console-box\n- title: "가이드 생성 결과"\n  desc: |\n    [System] build-guide.mjs 빌드 완료\n    [Success] C:\\ai\\cs_v2\\publish\\index.html 생성 성공!\n:::\n`;
        break;
      case "cmd-box":
        snippet = `\n::: cmd-box\n- title: "V2 서버 구동"\n  tag: "bash"\n  desc: "npm run dev"\n:::\n`;
        break;
      case "os-tabs":
        snippet = `\n::: os-tabs\n- title: "Windows"\n  desc: "Windows OS의 설정 가이드 내용을 마크다운으로 기술합니다."\n- title: "macOS"\n  desc: "macOS용 단축키 및 실행 명령어 가이드를 작성합니다."\n:::\n`;
        break;
      case "takeaway-banner":
        snippet = `\n::: takeaway-banner\n- icon: "💡"\n  title: "Key Takeaway"\n  desc: "숏코드의 진정한 가치는 텍스트 정보의 시각적 컴포넌트 자동화에 있습니다."\n:::\n`;
        break;
      case "step-flow":
        snippet = `\n::: step-flow\n- icon: "👨"\n  title: "요구사항 정의"\n  desc: "기능 정의 및 범위 확정"\n  tag: "active"\n- icon: "💻"\n  title: "시나리오 설계"\n  desc: "동선 및 와이어프레임 설계"\n:::\n`;
        break;
      case "part-banner":
        snippet = `\n::: part-banner\n- icon: "2부"\n  title: "핵심 가이드 마스터"\n  desc: "V2.0에서 강화된 숏코드로 다양한 웹/PPTX 변환 실무 적용하기"\n  tag: "Ch.10 - 20"\n:::\n`;
        break;
      case "summary-bar":
        snippet = `\n::: summary-bar\n- icon: "21종"\n  title: "핵심 숏코드"\n- icon: "29종"\n  title: "별칭 포함 지원 규격"\n:::\n`;
        break;
      case "badge-grid":
        snippet = `\n::: badge-grid\n- icon: "🌟"\n  title: "신속성"\n  tag: "Fast"\n- icon: "🔒"\n  title: "보안성"\n  tag: "Secure"\n:::\n`;
        break;
      case "skill-list":
        snippet = `\n::: skill-list\n- icon: "⚡"\n  title: "초고속 로딩"\n  desc: "Vite 기반 빌드로 브라우저 첫 렌더링 최적화"\n  bullet: "HMR 지원"\n:::\n`;
        break;
      default:
        return;
    }

    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);

    setMarkdown(before + snippet + after);

    // Focus back and position cursor after inserted snippet
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + snippet.length, start + snippet.length);
    }, 0);
  };
  
  // Style and Server files
  const [styles, setStyles] = useState<Record<string, any>>({});
  const [selectedStyle, setSelectedStyle] = useState("custom-blue");
  const [sourceFiles, setSourceFiles] = useState<string[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);

  // Split View & Generation options
  const [previewMode, setPreviewMode] = useState<"html" | "presentation">("html");
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [generatingPreview, setGeneratingPreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  
  // Final Save Options
  const [outputPath, setOutputPath] = useState("");
  const [saveOption, setSaveOption] = useState<"standalone" | "guideHub">("standalone");
  const [targetFormats, setTargetFormats] = useState<string[]>(["html", "presentation", "pptx"]);
  const [options] = useState({
    toc: true,
    noCover: false,
  });
  const [saving, setSaving] = useState(false);

  // Bulk Mode Options
  const [isBulkMode, setIsBulkMode] = useState<boolean>(false);
  const [bulkInputPath, setBulkInputPath] = useState<string>("md_src");
  const [bulkOutputPath, setBulkOutputPath] = useState<string>("publish");
  const [portalUrl, setPortalUrl] = useState<string>("");

  // Compute contrast ratio for selected style
  const currentStyle = styles[selectedStyle];
  let contrastRatio = 4.5;
  if (currentStyle && currentStyle.brand && currentStyle.bg) {
    contrastRatio = getContrast(currentStyle.brand, currentStyle.bg);
  }

  // Load styles and file list on mount
  useEffect(() => {
    fetchStyles();
    fetchFiles();
  }, []);

  // Initial preview render on load
  useEffect(() => {
    if (markdown) {
      triggerPreview(markdown, previewMode, selectedStyle);
    }
  }, [previewMode]);

  // Fetch styles from backend
  const fetchStyles = async () => {
    try {
      const res = await fetch("/api/list-styles");
      if (res.ok) {
        const data = await res.json();
        setStyles(data);
      }
    } catch (err) {
      console.error("Failed to load styles:", err);
    }
  };

  // Fetch files list from backend
  const fetchFiles = async () => {
    setLoadingFiles(true);
    try {
      const res = await fetch("/api/list-files");
      if (res.ok) {
        const data = await res.json();
        setSourceFiles(data.files || []);
      }
    } catch (err) {
      console.error("Failed to load source files:", err);
    } finally {
      setLoadingFiles(false);
    }
  };

  // Load selected server file content
  const handleLoadFile = async (filePath: string) => {
    try {
      const res = await fetch(`/api/load-file?path=${encodeURIComponent(filePath)}`);
      if (res.ok) {
        const data = await res.json();
        setMarkdown(data.content);
        setFilename(filePath.split(/[/\\]/).pop() || "guide_v2.md");
        
        // Extract style if present in frontmatter
        const styleMatch = data.content.match(/style:\s*([^\r\n]+)/);
        if (styleMatch && styleMatch[1]) {
          const matchedStyle = styleMatch[1].trim();
          if (styles[matchedStyle]) {
            setSelectedStyle(matchedStyle);
          }
        }
        
        toast({
          title: "파일 로드 완료",
          description: `서버에서 "${filePath}" 내용을 성공적으로 가져왔습니다.`,
        });
      }
    } catch (err: any) {
      toast({
        title: "파일 로드 실패",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  // Upload local markdown file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      setMarkdown(text);
      setFilename(file.name);
      
      const styleMatch = text.match(/style:\s*([^\r\n]+)/);
      if (styleMatch && styleMatch[1]) {
        const matchedStyle = styleMatch[1].trim();
        if (styles[matchedStyle]) {
          setSelectedStyle(matchedStyle);
        }
      }
      
      toast({
        title: "로컬 파일 로드 완료",
        description: `"${file.name}" 파일을 성공적으로 가져왔습니다.`,
      });
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Trigger preview compilation
  const triggerPreview = async (mdContent = markdown, mode = previewMode, style = selectedStyle) => {
    setGeneratingPreview(true);
    try {
      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown: mdContent, mode, style })
      });
      
      if (res.ok) {
        const html = await res.text();
        setPreviewHtml(html);
      } else {
        const errData = await res.json();
        throw new Error(errData.error || "Preview generation failed");
      }
    } catch (err: any) {
      toast({
        title: "미리보기 갱신 실패",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setGeneratingPreview(false);
    }
  };

  // Compile and Save
  const handleSaveAndCompile = async () => {
    setSaving(true);
    setPortalUrl("");
    try {
      if (targetFormats.length === 0) {
        toast({
          title: "알림",
          description: "최소 한 개 이상의 변환 포맷을 선택해 주세요.",
        });
        setSaving(false);
        return;
      }

      if (isBulkMode) {
        // Bulk Mode Compilation
        const res = await fetch("/api/bulk-convert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            inputDir: bulkInputPath,
            outputDir: bulkOutputPath,
            style: selectedStyle,
            formats: targetFormats,
            options,
          })
        });

        if (res.ok) {
          const result = await res.json();
          setPortalUrl(result.portalIndex);
          toast({
            title: "폴더 일괄 변환 완료",
            description: `${result.message}\n생성된 가이드 포털로 즉시 연결 가능합니다.`,
            duration: 6000,
          });
        } else {
          const errData = await res.json();
          throw new Error(errData.error || "폴더 일괄 변환 실패");
        }
      } else {
        // Single File Compilation
        if (!filename.trim()) {
          toast({
            title: "입력 오류",
            description: "저장할 파일명을 작성해 주세요.",
            variant: "destructive",
          });
          setSaving(false);
          return;
        }

        const res = await fetch("/api/save-generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            markdown,
            filename,
            outputPath,
            saveOption,
            formats: targetFormats,
            style: selectedStyle,
            options,
          }),
        });

        if (res.ok) {
          const result = await res.json();
          
          // HTML format included, set portal link
          const hasHtml = targetFormats.includes("html");
          if (hasHtml) {
            setPortalUrl("/publish/index.html");
          }

          toast({
            title: "변환 및 로컬 저장 완료",
            description: result.message,
            duration: 6000,
          });
        } else {
          const errData = await res.json();
          throw new Error(errData.error || "Save & generate failed");
        }
      }
    } catch (err: any) {
      toast({
        title: "저장 실패",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFormatToggle = (format: string) => {
    if (targetFormats.includes(format)) {
      setTargetFormats(targetFormats.filter(f => f !== format));
    } else {
      setTargetFormats([...targetFormats, format]);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)] min-h-[500px] text-slate-800">
      {/* Left panel: Editor & Settings */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col h-full space-y-4">
        {/* Editor Top Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500 font-semibold">문서 열기:</label>
              <select
                onChange={(e) => handleLoadFile(e.target.value)}
                className="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="">서버 문서 선택...</option>
                {sourceFiles.map((file) => (
                  <option key={file} value={file}>{file}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500 font-semibold">🧩 숏코드 삽입:</label>
              <select
                onChange={(e) => {
                  insertShortcode(e.target.value);
                  e.target.value = ""; // Reset value
                }}
                value=""
                className="bg-blue-50/50 border border-blue-200 text-blue-800 rounded px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer hover:bg-blue-550 hover:text-white transition-colors"
              >
                <option value="" disabled>선택 삽입...</option>
                <optgroup label="📋 비교 & 대조 (Compare & Diff)">
                  <option value="compare-split">⚖️ 2단 대조 비교 (compare-split)</option>
                  <option value="compare-diff">🔍 Before/After 대조 (compare-diff)</option>
                  <option value="compare-grid">📋 비교 그리드 (compare-grid)</option>
                  <option value="columns-grid">🗂️ 다단 정보 카드 그리드 (columns-grid)</option>
                </optgroup>
                <optgroup label="🖥️ 코드 & 터미널 (Code & Command)">
                  <option value="editor-box">🖥️ 에디터 시뮬레이션 (editor-box)</option>
                  <option value="console-box">💻 콘솔 출력 (console-box)</option>
                  <option value="cmd-box">⌨️ 터미널 명령어 (cmd-box)</option>
                </optgroup>
                <optgroup label="🕸️ 시각 자료 & 흐름 (Visuals & Flows)">
                  <option value="network-box">🕸️ 네트워크 다이어그램 (network-box)</option>
                  <option value="git-flow">🔧 Git Flow 흐름도 (git-flow)</option>
                  <option value="workflow-flow">🔄 가로 워크플로우 (workflow-flow)</option>
                  <option value="step-flow">➡️ 가로 이정표 흐름도 (step-flow)</option>
                </optgroup>
                <optgroup label="🧩 콘텐츠 그리드 (Content Grids)">
                  <option value="icon-grid">🧩 아이콘 카드 그리드 (icon-grid)</option>
                  <option value="feature-grid">⭐ 핵심 기능 카드 그리드 (feature-grid)</option>
                  <option value="tool-list">🧰 도구 목록 (tool-list)</option>
                  <option value="plan-grid">💳 요금제 카드 그리드 (plan-grid)</option>
                  <option value="badge-grid">🏷️ 배지 칩 그리드 (badge-grid)</option>
                  <option value="stat-grid">📊 통계 지표 그리드 (stat-grid)</option>
                  <option value="skill-list">🎯 스킬 리스트 (skill-list)</option>
                </optgroup>
                <optgroup label="📢 정보 & 알림 (Info & Highlights)">
                  <option value="alert-box">⚠️ 경고/알림 박스 (alert-box)</option>
                  <option value="summary-box">📝 하단 요약 박스 (summary-box)</option>
                  <option value="takeaway-banner">💡 핵심 테이크어웨이 (takeaway-banner)</option>
                  <option value="part-banner">🚩 파트/챕터 시작 배너 (part-banner)</option>
                  <option value="summary-bar">📈 하단 수치 요약 바 (summary-bar)</option>
                </optgroup>
                <optgroup label="🔢 구조 & 내비게이션 (Structure & Nav)">
                  <option value="step-list">🔢 순서형 단계 리스트 (step-list)</option>
                  <option value="faq-list">❓ FAQ 아코디언 (faq-list)</option>
                  <option value="os-tabs">📁 OS/탭 전환 (os-tabs)</option>
                </optgroup>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-800 px-3 py-1.5 rounded text-xs flex items-center gap-1 cursor-pointer transition-colors font-semibold font-sans">
              <Upload className="h-3 w-3" /> 로컬 파일 업로드
              <input
                type="file"
                accept=".md"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <select
              value={selectedStyle}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedStyle(val);
                setMarkdown(prev => {
                  if (prev.includes("style:")) {
                    return prev.replace(/style:\s*[^\r\n]+/, "style: " + val);
                  }
                  return prev;
                });
              }}
              className="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
            >
              {Object.entries(styles).map(([key, value]) => (
                <option key={key} value={key}>{value.label || key}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filename and refresh */}
        <div className="flex items-center justify-between gap-3 bg-slate-50 p-2 border border-slate-200 rounded-lg">
          <div className="flex items-center gap-2 flex-1">
            <FileText className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="bg-white border border-slate-200 rounded px-2.5 py-1 text-xs font-mono text-slate-800 flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="filename.md"
            />
          </div>
          <button
            onClick={() => triggerPreview(markdown, previewMode, selectedStyle)}
            disabled={generatingPreview}
            className="bg-blue-600 hover:bg-blue-550 disabled:opacity-50 text-white font-semibold py-1.5 px-3 rounded text-xs flex items-center gap-1 transition-all shadow-sm"
          >
            {generatingPreview ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
            <span>미리보기 반영</span>
          </button>
        </div>

        {/* Markdown Source Area */}
        <div className="flex-1 min-h-[220px]">
          <textarea
            ref={textareaRef}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="w-full h-full bg-slate-50 text-slate-800 border border-slate-200 rounded-lg p-4 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            spellCheck={false}
          />
        </div>

        {/* Bulk compile switch */}
        <div className="flex items-center gap-6 border-t border-slate-200 pt-3 text-xs">
          <label className="flex items-center gap-2 font-semibold text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={isBulkMode}
              onChange={(e) => setIsBulkMode(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            📁 폴더 일괄 변환 (마크다운 폴더 매핑 컴파일)
          </label>
        </div>

        {/* Compile Settings */}
        <div className="border-t border-slate-200 pt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <div className="font-semibold text-slate-500">1. 대상 포맷 선택</div>
            <div className="flex flex-wrap gap-2">
              {["html", "presentation", "pptx"].map((fmt) => {
                const checked = targetFormats.includes(fmt);
                return (
                  <button
                    key={fmt}
                    onClick={() => handleFormatToggle(fmt)}
                    className={`px-3 py-1.5 rounded-md border flex items-center gap-1 transition-all font-semibold ${
                      checked
                        ? 'bg-blue-600/10 border-blue-500 text-blue-600'
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-350'
                    }`}
                  >
                    <span>{fmt.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            {!isBulkMode ? (
              <>
                <div className="font-semibold text-slate-500">2. 저장 위치 옵션</div>
                <div className="flex flex-col gap-1.5">
                  <select
                    value={saveOption}
                    onChange={(e) => setSaveOption(e.target.value as any)}
                    className="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                  >
                    <option value="standalone">독립 파일 단독 생성</option>
                    <option value="guideHub">가이드 허브 목록 추가 및 전체 빌드</option>
                  </select>
                  <input
                    type="text"
                    value={outputPath}
                    onChange={(e) => setOutputPath(e.target.value)}
                    className="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-800 font-mono w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="기본값 (storage/)"
                  />
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <div className="font-semibold text-slate-500">2. 입력 폴더</div>
                  <input
                    type="text"
                    value={bulkInputPath}
                    onChange={(e) => setBulkInputPath(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-[11px] text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="md_src"
                  />
                </div>
                <div className="space-y-1">
                  <div className="font-semibold text-slate-500">3. 출력 폴더</div>
                  <input
                    type="text"
                    value={bulkOutputPath}
                    onChange={(e) => setBulkOutputPath(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-[11px] text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="publish"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Link to generated portal */}
        {portalUrl && (
          <a
            href={portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-600 hover:bg-emerald-550 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm text-xs"
          >
            <span>📚 빌드 완료: 가이드북 포털 허브 바로가기 ↗</span>
          </a>
        )}

        <button
          onClick={handleSaveAndCompile}
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-550 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>{isBulkMode ? "선택 폴더 일괄 숏코드 컴파일 실행" : "V2 마크다운 컴파일 및 저장"}</span>
        </button>
      </div>

      {/* Right panel: Live Preview */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col h-full space-y-4">
        {/* Preview Toolbar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex gap-1.5 bg-slate-100 p-1 border border-slate-200 rounded-lg">
            <button
              onClick={() => setPreviewMode("html")}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                previewMode === "html"
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              A4 Guide
            </button>
            <button
              onClick={() => setPreviewMode("presentation")}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                previewMode === "presentation"
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              16:9 Slides
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 border border-slate-200 rounded-lg">
            <button
              onClick={() => setPreviewDevice("desktop")}
              className={`p-1.5 rounded transition-colors ${previewDevice === "desktop" ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
              title="Desktop"
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setPreviewDevice("tablet")}
              className={`p-1.5 rounded transition-colors ${previewDevice === "tablet" ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
              title="Tablet"
            >
              <Tablet className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setPreviewDevice("mobile")}
              className={`p-1.5 rounded transition-colors ${previewDevice === "mobile" ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
              title="Mobile"
            >
              <Smartphone className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Live Contrast Linter Warning Banner */}
        {contrastRatio < 4.5 && currentStyle && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-3 text-[11px] flex items-start gap-2.5 shadow-sm leading-relaxed">
            <span className="text-base select-none shrink-0">⚠️</span>
            <div>
              <strong>가독성 대비 경고 (WCAG AA 미달)</strong><br />
              선택한 테마 <code>{currentStyle?.label || selectedStyle}</code>의 주컬러와 배경색 간의 명도 대비도가 <strong>{contrastRatio.toFixed(2)}:1</strong>로 WCAG AA 가이드라인 기준(4.5:1)에 미달합니다. 
              가독성 확보를 위해 <span className="underline font-bold text-amber-900">디자인 시스템 조율</span> 탭에서 해당 테마의 브랜드 색상 명도(L값)를 조절할 것을 권장합니다.
            </div>
          </div>
        )}

        {/* Live Preview Iframe Frame */}
        <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center p-2">
          <div
            className="w-full h-full bg-white rounded-lg overflow-hidden border border-slate-200/60 shadow-sm"
            style={{
              width: previewDevice === "desktop" ? "100%" : previewDevice === "tablet" ? "768px" : "375px",
              maxWidth: "100%",
              aspectRatio: previewMode === "presentation" ? "16 / 9" : "auto",
            }}
          >
            {generatingPreview && !previewHtml ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2 bg-slate-50">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                <span className="text-xs">Generating preview...</span>
              </div>
            ) : previewHtml ? (
              <iframe
                title="Markdown Compiler Preview Frame"
                srcDoc={previewHtml}
                className="w-full h-full border-0"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs bg-slate-50 font-semibold">
                [미리보기 반영] 버튼을 눌러 컴파일 결과물을 표시합니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
