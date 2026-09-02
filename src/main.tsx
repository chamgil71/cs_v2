import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BarChart3, PenTool, Sparkles, Palette } from 'lucide-react';
import './index.css'; // V1 CSS 리소스 재활용
import PptxInspectorSuite from './components/PptxInspectorSuite';
import DesignSystemSuite from './components/DesignSystemSuite';
import MarkdownCompiler from './components/MarkdownCompiler';
import ErrorBoundary from './components/ErrorBoundary';

type ModuleKey = 'design-system' | 'guide-authoring' | 'pptx-inspector';

const MODULES: { key: ModuleKey; label: string; icon: typeof Palette }[] = [
  { key: 'design-system', label: '1. 디자인 시스템', icon: Palette },
  { key: 'guide-authoring', label: '2. 가이드북 저작', icon: PenTool },
  { key: 'pptx-inspector', label: '3. PPTX 인스펙터', icon: BarChart3 },
];

/**
 * 웹 디자인 스위트 — 대시보드 (dashboard.html)
 * 3개 모듈을 동급 탭으로 배치한다. 워크플로 순서를 따른다:
 *   1. 디자인 시스템(테마·배색 확정) → 2. 가이드북 저작(그 테마로 콘텐츠 작성) → 3. PPTX 인스펙터(기존 파일 분석, 독립 워크플로)
 */
function V2App() {
  const [activeModule, setActiveModule] = useState<ModuleKey>('design-system');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      <header className="bg-slate-900 border-b border-slate-800 text-slate-100 px-6 py-4 flex flex-col md:flex-row items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <Sparkles className="h-5 w-5 text-blue-500 shrink-0" />
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white">Creative Spark V2.0 — 웹 디자인 스위트</h1>
            <div className="text-xs text-slate-400 font-semibold tracking-wider">디자인 시스템 · 가이드북 저작 · PPTX 인스펙터</div>
          </div>
          {import.meta.env.DEV ? (
            <span className="ml-2 bg-blue-400/25 text-blue-200 border border-blue-400/30 text-xs px-2 py-0.5 rounded-full font-bold">
              Vite Dev Server
            </span>
          ) : (
            <span className="ml-2 bg-emerald-400/25 text-emerald-200 border border-emerald-400/30 text-xs px-2 py-0.5 rounded-full font-bold">
              Standalone
            </span>
          )}
        </div>

        <nav className="flex gap-2">
          {MODULES.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveModule(key)}
              className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeModule === key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-blue-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {activeModule === 'design-system' && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <h2 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <Palette className="h-4 w-4 text-blue-600" />
                <span>디자인 시스템 — 테마 조율 & 보조 유틸리티</span>
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                기존 스타일 프리셋의 HSL 색상 변수를 미세 튜닝하거나 직접 배색을 기획해 <code className="text-xs bg-slate-100 px-1 rounded">styles.json</code>에 등록합니다. 대비 검사기·팔레트 빌더·컬러 리매퍼 같은 보조 도구도 여기서 함께 씁니다.
              </p>
            </div>
            <ErrorBoundary label="디자인 시스템">
              <DesignSystemSuite />
            </ErrorBoundary>
          </div>
        )}

        {activeModule === 'guide-authoring' && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <h2 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <PenTool className="h-4 w-4 text-blue-600" />
                <span>가이드북 저작 — 마크다운 작성 및 빌드</span>
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                마크다운 에디터와 split-pane 실시간 프리뷰를 제공합니다. 컴파일 시 1번 모듈에서 정한 <code className="text-xs bg-slate-100 px-1 rounded">styles.json</code> 테마를 가이드북·슬라이드 구조에 그대로 주입합니다.
              </p>
            </div>
            <ErrorBoundary label="마크다운 가이드북 컴파일러">
              <MarkdownCompiler />
            </ErrorBoundary>
          </div>
        )}

        {activeModule === 'pptx-inspector' && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <span>PPTX 디자인 인스펙터 & 튜너</span>
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                업로드한 PPTX 파일의 XML 구조를 해체하여 디자인 사양(색상/폰트/레이아웃)을 벤치마킹 분석하고, 특정 구형 색상을 XML 1:1 리매핑하여 강제 일괄 치환해 줍니다.
                <span className="text-blue-600 font-bold ml-1">1·2번 모듈과 독립된 별개 워크플로 — 기존 PPTX 파일을 다룰 때만 사용합니다.</span>
              </p>
            </div>
            <ErrorBoundary label="PPTX 디자인 인스펙터">
              <PptxInspectorSuite />
            </ErrorBoundary>
          </div>
        )}
      </main>
    </div>
  );
}

// React Mount
const mountApp = () => {
  const root = document.getElementById('root');
  if (root) {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <V2App />
      </React.StrictMode>
    );
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
