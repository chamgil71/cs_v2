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
  Save,
  AlertTriangle,
  HelpCircle,
  BookOpen,
  X,
  Copy,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { getContrast, getLuminance } from '../lib/wcag';
import { clientCompileMarkdown, BUNDLED_STYLES } from '../lib/client-compiler';
import { convertMdToPptxBrowser } from '../lib/pptx-browser';
import showcaseMd from '../../md_src/showcase/showcase.md?raw';


const downloadFile = (content: string, filename: string, contentType: string) => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
import { SHORTCODE_DOCS } from "../../config/shortcode-guide";

export default function MarkdownCompiler() {
  const { toast } = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewWrapRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);

  // Markdown editor states
  const [markdown, setMarkdown] = useState<string>(showcaseMd);
  const [filename, setFilename] = useState("showcase.md");

  // Insert shortcode at cursor position
  const insertShortcode = (type: string) => {
    if (!type) return;
    const doc = SHORTCODE_DOCS.find((d) => d.key === type);
    if (!doc) return;
    const snippet = `
${doc.snippet}
`;

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
  const [styles, setStyles] = useState<Record<string, any>>(BUNDLED_STYLES);
  const [selectedStyle, setSelectedStyle] = useState("custom-blue");
  const [sourceFiles, setSourceFiles] = useState<string[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);

  // Split View & Generation options
  const [previewMode, setPreviewMode] = useState<"html" | "presentation">("html");
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [generatingPreview, setGeneratingPreview] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [iframeContentHeight, setIframeContentHeight] = useState(0);
  const [previewContainerHeight, setPreviewContainerHeight] = useState(600);
  
  // Final Save Options
  const [outputPath, setOutputPath] = useState("");
  const [saveOption, setSaveOption] = useState<"export" | "guideHub">("export");
  const [targetFormats, setTargetFormats] = useState<string[]>(["html", "presentation", "pptx"]);
  const [options] = useState({
    toc: true,
    noCover: false,
  });
  const [saving, setSaving] = useState(false);
  const [hasServer, setHasServer] = useState<boolean | null>(null);

  // Bulk Mode Options
  const [isBulkMode, setIsBulkMode] = useState<boolean>(false);
  const [bulkInputPath, setBulkInputPath] = useState<string>("md_src");
  const [bulkOutputPath, setBulkOutputPath] = useState<string>("publish");
  const [portalUrl, setPortalUrl] = useState<string>("");
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopySnippet = (key: string, snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedKey(key);
    toast({
      title: "템플릿 복사 완료",
      description: "클립보드에 숏코드 템플릿이 복사되었습니다. 에디터에 붙여넣어 사용하세요.",
    });
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  // Compute contrast ratio for selected style
  const currentStyle = styles[selectedStyle];
  let contrastRatio = 4.5;
  let bgIsLight = true;
  if (currentStyle && currentStyle.brand && currentStyle.bg) {
    contrastRatio = getContrast(currentStyle.brand, currentStyle.bg);
    bgIsLight = getLuminance(currentStyle.bg) > 0.5;
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

  // Scale preview iframe to fit container
  useEffect(() => {
    const el = previewWrapRef.current;
    if (!el) return;
    const VIRTUAL_W = previewDevice === "mobile" ? 375 : previewDevice === "tablet" ? 768 : 1200;
    const calc = (w: number, h: number) => {
      setPreviewScale(w > 0 ? Math.min(1, w / VIRTUAL_W) : 1);
      if (h > 0) setPreviewContainerHeight(h);
    };
    const rect = el.getBoundingClientRect();
    calc(rect.width, rect.height);
    const ro = new ResizeObserver(([entry]) => calc(entry.contentRect.width, entry.contentRect.height));
    ro.observe(el);
    return () => ro.disconnect();
  }, [previewDevice]);

  // Fetch styles from backend; sets hasServer based on API availability
  const fetchStyles = async () => {
    try {
      const res = await fetch("/api/list-styles");
      if (res.ok) {
        const data = await res.json();
        setStyles(data);
        setHasServer(true);
      } else {
        setStyles(BUNDLED_STYLES);
        setHasServer(false);
      }
    } catch (err) {
      console.error("Failed to load styles, using fallback:", err);
      setStyles(BUNDLED_STYLES);
      setHasServer(false);
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
    setIframeContentHeight(0);

    // Presentation mode: show actual presentation HTML (dark, horizontal slides)
    // 컨테이너가 aspect-ratio:16/9 이므로 1280×720 iframe이 너비 기준으로 축소되어 잘리지 않음
    if (mode === "presentation") {
      try {
        const localHtml = clientCompileMarkdown(mdContent, "presentation", style, styles);
        setPreviewHtml(localHtml);
      } catch (localErr: any) {
        toast({ title: "로컬 컴파일 오류", description: (localErr as Error).message, variant: "destructive" });
      }
      setGeneratingPreview(false);
      return;
    }

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
      console.warn("API preview failed, falling back to client-side compiler:", err.message);
      try {
        const localHtml = clientCompileMarkdown(mdContent, mode, style, styles);
        setPreviewHtml(localHtml);
      } catch (localErr: any) {
        toast({
          title: "로컬 컴파일 오류",
          description: localErr.message,
          variant: "destructive",
        });
      }
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
          if (result.portalIndex) setPortalUrl(result.portalIndex);
          toast({
            title: "폴더 일괄 변환 완료",
            description: result.portalIndex
              ? `${result.message}\n생성된 가이드 포털로 즉시 연결 가능합니다.`
              : result.message,
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

          // 서버가 실제로 미리볼 수 있는 링크를 만들었을 때만(가이드 컬렉션 저장 시 public/으로 재빌드된 경우) 노출.
          // "임시 내보내기"는 저장 위치가 임의라(기본 publish/·storage/) 개발서버가 못 열어주므로 링크를 만들지 않는다.
          if (result.portalUrl) {
            setPortalUrl(result.portalUrl);
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
      console.warn("Save & generate server API failed, falling back to local download:", err);
      
      // Standalone/Offline fallback
      if (!isBulkMode) {
        try {
          const hasHtml = targetFormats.includes("html");
          const hasPresentation = targetFormats.includes("presentation");
          const hasPptx = targetFormats.includes("pptx");

          // 1. Download HTML Guide if selected
          if (hasHtml) {
            const htmlContent = clientCompileMarkdown(markdown, "html", selectedStyle, styles);
            const htmlName = filename.replace(/\.md$/i, ".html");
            downloadFile(htmlContent, htmlName, "text/html;charset=utf-8");
          }

          // 3. Generate and download presentation HTML
          if (hasPresentation) {
            const presHtml = clientCompileMarkdown(markdown, "presentation", selectedStyle, styles);
            const presName = filename.replace(/\.md$/i, "_presentation.html");
            downloadFile(presHtml, presName, "text/html;charset=utf-8");
          }

          // 4. Export to PPTX via pptx-browser (server-side 로직과 동일한 렌더링)
          if (hasPptx) {
            const pptxName = filename.replace(/\.md$/i, ".pptx");
            toast({ title: "PPTX 생성 중...", description: "슬라이드를 브라우저에서 렌더링하고 있습니다." });
            await convertMdToPptxBrowser(markdown, pptxName, { styleOverride: selectedStyle });
          }

          const downloadedFormats = [
            "마크다운(.md)",
            hasHtml ? "HTML 가이드" : null,
            hasPresentation ? "프레젠테이션 HTML" : null,
            hasPptx ? "PPTX 슬라이드" : null,
          ].filter(Boolean).join(", ");

          toast({
            title: "로컬 다운로드 완료",
            description: `${downloadedFormats}를 브라우저에서 직접 저장했습니다.`,
          });
          return;
        } catch (localErr: any) {
          toast({
            title: "오프라인 변환 오류",
            description: localErr.message,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "폴더 일괄 변환 불가",
          description: "폴더 선택 및 일괄 변환은 로컬 백엔드 API 서버가 켜져 있어야 작동합니다. 오프라인 모드에서는 개별 파일의 마크다운 및 HTML 컴파일 다운로드만 가능합니다.",
          variant: "destructive",
        });
      }
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

  const handleFolderPick = async (target: "input" | "output" | "save") => {
    try {
      const res = await fetch("/api/select-folder", {
        method: "POST"
      });
      if (res.ok) {
        const data = await res.json();
        if (data.selectedPath) {
          if (target === "input") {
            setBulkInputPath(data.selectedPath);
          } else if (target === "output") {
            setBulkOutputPath(data.selectedPath);
          } else if (target === "save") {
            setOutputPath(data.selectedPath);
          }
          toast({
            title: "폴더 선택 완료",
            description: `선택된 경로: ${data.selectedPath}`,
          });
        }
      } else {
        const errData = await res.json();
        throw new Error(errData.error || "폴더 선택 실패");
      }
    } catch (err: any) {
      toast({
        title: "오프라인 상태 또는 오류",
        description: "로컬 백엔드 서버가 구동 중일 때만 폴더 선택 다이얼로그를 사용할 수 있습니다. 경로를 텍스트로 직접 입력해 주세요.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-[calc(100vh-140px)] h-auto min-h-[500px] text-slate-800">
      {/* Left panel: Editor & Settings */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col lg:h-full h-auto min-h-[450px] space-y-4">
        {/* Editor Top Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex flex-wrap items-center gap-4">
            {hasServer !== false && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-500 font-semibold">문서 열기:</label>
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
            )}

            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-500 font-semibold">숏코드 삽입:</label>
              <select
                onChange={(e) => {
                  insertShortcode(e.target.value);
                  e.target.value = ""; // Reset value
                }}
                value=""
                className="bg-blue-50/50 border border-blue-200 text-blue-800 rounded px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer hover:bg-blue-600 hover:text-white transition-colors"
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
              <button
                type="button"
                onClick={() => setShowGuide(true)}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-800 px-3 py-1.5 rounded text-xs flex items-center gap-1 transition-colors font-semibold shadow-sm shrink-0"
                title="숏코드 설명서 보기"
              >
                <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                <span>숏코드 설명서</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-800 px-3 py-1.5 rounded text-sm flex items-center gap-1 cursor-pointer transition-colors font-semibold font-sans">
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
              className="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
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
              className="bg-white border border-slate-200 rounded px-2.5 py-1 text-sm font-mono text-slate-800 flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="filename.md"
            />
          </div>
          <button
            onClick={() => triggerPreview(markdown, previewMode, selectedStyle)}
            disabled={generatingPreview}
            className="bg-blue-600 hover:bg-blue-600 disabled:opacity-50 text-white font-semibold py-1.5 px-3 rounded text-sm flex items-center gap-1 transition-all shadow-sm"
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
            className="w-full h-full bg-slate-50 text-slate-800 border border-slate-200 rounded-lg p-4 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none overflow-y-auto"
            spellCheck={false}
          />
        </div>

        {/* Bulk compile switch — 서버 연결 시에만 노출 */}
        {hasServer !== false && (
          <div className="flex items-center gap-6 border-t border-slate-200 pt-3 text-sm">
            <label className="flex items-center gap-2 font-semibold text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={isBulkMode}
                onChange={(e) => setIsBulkMode(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              폴더 일괄 변환 (마크다운 폴더 매핑 컴파일)
            </label>
          </div>
        )}

        {/* Compile Settings */}
        <div className="border-t border-slate-200 pt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
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
                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'
                    }`}
                  >
                    <span>{fmt.toUpperCase()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {hasServer !== false && (
            <div className="space-y-2">
              {!isBulkMode ? (
                <>
                  <div className="font-semibold text-slate-500 flex items-center justify-between">
                    <span>2. 저장 위치 옵션</span>
                    <button
                      type="button"
                      onClick={() => handleFolderPick("save")}
                      className="text-xs text-blue-600 hover:text-blue-800 font-bold underline"
                    >
                      폴더 선택...
                    </button>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <select
                      value={saveOption}
                      onChange={(e) => setSaveOption(e.target.value as any)}
                      className="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
                    >
                      <option value="export">임시 내보내기 (컬렉션에 저장 안 함)</option>
                      <option value="guideHub">가이드 컬렉션에 저장 + 전체 재빌드</option>
                    </select>
                    <input
                      type="text"
                      value={outputPath}
                      onChange={(e) => setOutputPath(e.target.value)}
                      className="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-sm text-slate-800 font-mono w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="기본값: html→publish/, 프레젠테이션/pptx→storage/"
                    />
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-500 flex items-center justify-between">
                      <span>2. 입력 폴더</span>
                      <button
                        type="button"
                        onClick={() => handleFolderPick("input")}
                        className="text-xs text-blue-600 hover:text-blue-800 font-bold underline"
                      >
                        선택...
                      </button>
                    </div>
                    <input
                      type="text"
                      value={bulkInputPath}
                      onChange={(e) => setBulkInputPath(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="md_src"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="font-semibold text-slate-500 flex items-center justify-between">
                      <span>3. 출력 폴더</span>
                      <button
                        type="button"
                        onClick={() => handleFolderPick("output")}
                        className="text-xs text-blue-600 hover:text-blue-800 font-bold underline"
                      >
                        선택...
                      </button>
                    </div>
                    <input
                      type="text"
                      value={bulkOutputPath}
                      onChange={(e) => setBulkOutputPath(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="publish"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Link to generated portal */}
        {portalUrl && (
          <a
            href={portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-emerald-600 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-sm text-sm"
          >
            <span>빌드 완료: 가이드북 포털 허브 바로가기 ↗</span>
          </a>
        )}

        <button
          onClick={handleSaveAndCompile}
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm text-sm"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>
            {isBulkMode
              ? "선택 폴더 일괄 숏코드 컴파일 실행"
              : hasServer === false
                ? "마크다운 컴파일 · 브라우저 다운로드"
                : "V2 마크다운 컴파일 및 저장"}
          </span>
        </button>
      </div>

      {/* Right panel: Live Preview */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col lg:h-full h-auto min-h-[450px] space-y-4">
        {/* Preview Toolbar */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex gap-1.5 bg-slate-100 p-1 border border-slate-200 rounded-lg">
            <button
              onClick={() => setPreviewMode("html")}
              className={`px-3 py-1.5 rounded text-sm font-semibold transition-colors ${
                previewMode === "html"
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              A4 Guide
            </button>
            <button
              onClick={() => setPreviewMode("presentation")}
              className={`px-3 py-1.5 rounded text-sm font-semibold transition-colors ${
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

        {/* Live Preview Iframe Frame
            - presentation: 컨테이너를 aspect-ratio:16/9 고정 → 1280×720 iframe을 너비 기준 scale
            - html desktop: scale 없이 100% 너비로 직접 표시 (스크롤 가능)
            - html tablet/mobile: 가상 뷰포트 scale 적용 */}
        <div
          ref={previewWrapRef}
          className={`bg-slate-100 border border-slate-200 rounded-xl relative overflow-hidden ${
            previewMode === "presentation" ? "w-full" : "flex-1 min-h-[300px]"
          }`}
          style={previewMode === "presentation" ? { aspectRatio: "16 / 9" } : undefined}
        >
          {generatingPreview && !previewHtml ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2 bg-slate-50">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <span className="text-xs">Generating preview...</span>
            </div>
          ) : previewHtml ? (
            (() => {
              if (previewMode === "presentation") {
                const cw = previewWrapRef.current?.clientWidth ?? 800;
                const scale = Math.min(1, cw / 1280);
                return (
                  <div style={{ width: 1280, height: 720, transform: `scale(${scale})`, transformOrigin: "top left", position: "absolute", top: 0, left: 0 }}>
                    <iframe
                      title="Markdown Compiler Preview Frame"
                      srcDoc={previewHtml}
                      style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                      scrolling="no"
                    />
                  </div>
                );
              }
              // HTML 가이드 모드: 가상 뷰포트 scale 적용 (desktop 1200px, tablet 768px, mobile 375px)
              const VIRTUAL_W = previewDevice === "desktop" ? 1200 : previewDevice === "mobile" ? 375 : 768;
              const VIRTUAL_H = previewScale > 0 && previewContainerHeight > 0
                ? Math.round(previewContainerHeight / previewScale)
                : 900;
              return (
                <div style={{ width: VIRTUAL_W, height: VIRTUAL_H, transform: `scale(${previewScale})`, transformOrigin: "top left", position: "absolute", top: 0, left: 0 }}>
                  <iframe
                    title="Markdown Compiler Preview Frame"
                    srcDoc={previewHtml}
                    style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                    scrolling="yes"
                  />
                </div>
              );
            })()
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-xs bg-slate-50 font-semibold">
              [미리보기 반영] 버튼을 눌러 컴파일 결과물을 표시합니다.
            </div>
          )}
          {/* Scale indicator — 프레젠테이션 또는 mobile/tablet HTML 모드일 때만 표시 */}
          {previewHtml && (previewMode === "presentation" || previewDevice !== "desktop") && (
            <div className="absolute bottom-2 right-2 bg-slate-800/70 text-white text-[10px] px-1.5 py-0.5 rounded pointer-events-none select-none">
              {previewMode === "presentation"
                ? `${Math.round(Math.min(1, (previewWrapRef.current?.clientWidth ?? 800) / 1280) * 100)}% · 16:9`
                : `${Math.round(previewScale * 100)}% · ${previewDevice}`}
            </div>
          )}
        </div>

        {/* Live Contrast Linter Warning Banner — 미리보기 하단 */}
        {contrastRatio < 4.5 && currentStyle && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-3 text-xs flex items-start gap-2 shadow-sm leading-relaxed">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>가독성 대비 경고 (WCAG AA 미달)</strong>{" "}
              선택한 테마 <code>{currentStyle?.label || selectedStyle}</code>의 주컬러 대비도가 <strong>{contrastRatio.toFixed(2)}:1</strong>로 기준(4.5:1)에 미달합니다.{" "}
              <span className="underline font-bold text-amber-900">디자인 시스템 조율</span> 탭에서 브랜드 주컬러를 {bgIsLight ? "더 어두운" : "더 밝은"} 계열로 조정하세요.
            </div>
          </div>
        )}
      </div>
      
      {showGuide && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-xl max-w-4xl w-full h-[85vh] overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-800">🧩 V2.0 숏코드 레퍼런스 설명서</h3>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-semibold">총 25종</span>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 p-1.5 rounded-lg transition-colors"
                title="닫기"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Filter Bar */}
            <div className="border-b border-slate-100 px-6 py-3 bg-white flex flex-col md:flex-row gap-3 items-center justify-between">
              {/* Category tabs */}
              <div className="flex flex-wrap gap-1">
                {["전체", "비교 & 대조", "코드 & 터미널", "시각 자료 & 흐름", "콘텐츠 그리드", "정보 & 알림", "구조 & 내비게이션"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      selectedCategory === cat
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search input */}
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="숏코드 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                />
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SHORTCODE_DOCS.filter((doc) => {
                  const matchesCat = selectedCategory === "전체" || doc.category === selectedCategory;
                  const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                        doc.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                        doc.desc.toLowerCase().includes(searchQuery.toLowerCase());
                  return matchesCat && matchesSearch;
                }).map((doc) => (
                  <div key={doc.key} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1">
                          {doc.name}
                        </h4>
                        <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-semibold">
                          {doc.category}
                        </span>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed mb-3">
                        {doc.desc}
                      </p>
                      {doc.fields && (
                        <div className="text-[11px] text-slate-400 mb-4 bg-slate-50 px-2.5 py-1.5 rounded font-mono">
                          <strong className="text-slate-500 font-sans">지원 필드:</strong> {doc.fields}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="relative">
                        <pre className="bg-slate-900 text-slate-100 p-3 rounded-lg text-[10px] font-mono overflow-x-auto whitespace-pre-wrap max-h-36 text-left">
                          <code>{doc.snippet}</code>
                        </pre>
                        <button
                          onClick={() => handleCopySnippet(doc.key, doc.snippet)}
                          className="absolute right-2 top-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white p-1.5 rounded transition-all shadow border border-slate-700/50"
                          title="스니펫 복사"
                        >
                          {copiedKey === doc.key ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400 animate-in zoom-in" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-200 px-6 py-3 bg-slate-50 flex justify-between items-center text-xs text-slate-500 font-semibold">
              <span>💡 모든 숏코드에 <code className="bg-slate-200 px-1 rounded font-mono text-slate-700">title-size=0.9</code> / <code className="bg-slate-200 px-1 rounded font-mono text-slate-700">desc-size=1rem</code> 인수로 블록별 폰트 크기 조정 가능</span>
              <button
                onClick={() => setShowGuide(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-1.5 rounded-md transition-colors text-xs"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
