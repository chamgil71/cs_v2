import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // V1 CSS 리소스 재활용
import PptxInspectorSuite from './components/PptxInspectorSuite';
import VisualAdjuster from './components/VisualAdjuster';
import MarkdownCompiler from './components/MarkdownCompiler';

function V2App() {
  // Main Top-level Tabs: 'pptx-inspector' (독립 도구) | 'guide-compiler' (연계형 도구)
  const [activeMainTab, setActiveMainTab] = useState<'pptx-inspector' | 'guide-compiler'>('pptx-inspector');
  
  // Sub Tabs within guide-compiler: 'write' (가이드 작성 및 빌드) | 'design-system' (테마 조율 및 빌더)
  const [activeSubTab, setActiveSubTab] = useState<'write' | 'design-system'>('write');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {/* V2 Header: 네이비 블루 배경 (#1e3a5f) 및 흰색 텍스트 */}
      <header className="bg-[#1e3a5f] text-white px-6 py-4 flex flex-col md:flex-row items-center justify-between shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <span className="text-2xl">🎨</span>
          <div>
            <h1 className="text-lg font-bold tracking-tight">Creative Spark V2.0 Design Suite</h1>
            <div className="text-[10px] text-blue-200/80 font-semibold uppercase tracking-wider">독립형 PPTX 분석 & 연계형 저작 시스템</div>
          </div>
          <span className="ml-2 bg-blue-400/25 text-blue-200 border border-blue-400/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
            Vite Dev Server
          </span>
        </div>

        {/* Main Tab Controls */}
        <nav className="flex gap-2">
          <button
            onClick={() => setActiveMainTab('pptx-inspector')}
            className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeMainTab === 'pptx-inspector'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-blue-100 hover:text-white hover:bg-white/10'
            }`}
          >
            📊 PPTX 디자인 인스펙터 (단독 도구)
          </button>
          <button
            onClick={() => setActiveMainTab('guide-compiler')}
            className={`px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              activeMainTab === 'guide-compiler'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-blue-100 hover:text-white hover:bg-white/10'
            }`}
          >
            ✍️ 마크다운 가이드북 컴파일러 (연계형 도구)
          </button>
        </nav>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {activeMainTab === 'pptx-inspector' && (
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-base font-bold text-[#1e3a5f] mb-1">📊 PPTX 디자인 인스펙터 & 튜너</h2>
              <p className="text-slate-500 text-xs">
                업로드한 PPTX 파일의 XML 구조를 해체하여 디자인 사양(색상/폰트/레이아웃)을 벤치마킹 분석하고, 특정 구형 색상을 XML 1:1 리매핑하여 강제 일괄 치환해 줍니다. 
                <span className="text-blue-600 font-bold ml-1">이 도구는 외부 서버 API 없이 브라우저 내에서 100% 서버리스로 가공·완결되어 독립 동작합니다.</span>
              </p>
            </div>
            <PptxInspectorSuite />
          </div>
        )}

        {activeMainTab === 'guide-compiler' && (
          <div className="space-y-4">
            {/* Connected Tool Sub Navigation */}
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setActiveSubTab('write')}
                className={`px-5 py-2.5 text-xs font-bold border-b-2 transition-all ${
                  activeSubTab === 'write'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-550 hover:text-slate-800'
                }`}
              >
                1. 가이드북 마크다운 작성 & 컴파일
              </button>
              <button
                onClick={() => setActiveSubTab('design-system')}
                className={`px-5 py-2.5 text-xs font-bold border-b-2 transition-all ${
                  activeSubTab === 'design-system'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-550 hover:text-slate-800'
                }`}
              >
                2. 디자인 시스템 조율 & 배색 빌더 (styles.json)
              </button>
            </div>

            {activeSubTab === 'write' && (
              <div className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <h3 className="text-sm font-bold text-[#1e3a5f] mb-0.5">✍️ 가이드북 마크다운 작성 및 빌드</h3>
                  <p className="text-slate-500 text-[11px]">
                    마크다운 에디터와 split-pane 실시간 프리뷰를 제공합니다. 컴파일 시 `styles.json`에 저장된 테마 규격 색상을 가이드북 및 슬라이드 구조에 주입합니다.
                  </p>
                </div>
                <MarkdownCompiler />
              </div>
            )}

            {activeSubTab === 'design-system' && (
              <div className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                  <h3 className="text-sm font-bold text-[#1e3a5f] mb-0.5">⚙️ 디자인 시스템 테마 조율 & 커스텀 배색 빌더</h3>
                  <p className="text-slate-500 text-[11px]">
                    기존 스타일 프리셋의 HSL 색상 변수를 미세 튜닝하거나, 사용자가 직접 메인·서브·강조 배색 조합을 기획하고 WCAG 대비 검증을 마친 후 `styles.json`에 신규 테마로 영구 등록합니다.
                  </p>
                </div>
                <VisualAdjuster />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

// React Mount
const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <V2App />
    </React.StrictMode>
  );
}
