import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { PenTool, Sparkles, Sliders } from 'lucide-react';
import '../index.css';
import MarkdownCompiler from '../components/MarkdownCompiler';
import VisualAdjuster from '../components/VisualAdjuster';
import ErrorBoundary from '../components/ErrorBoundary';

/**
 * 모듈 2 단독 패키지 — 마크다운 가이드북 컴파일러 & 디자인 시스템 배색 빌더
 *
 * 원래 Vite API 미들웨어 서버와 연계되는 도구이나, 서버가 없는 standalone 환경에서는
 * MarkdownCompiler 내부의 클라이언트 사이드 컴파일러(client-compiler.ts) 폴백으로
 * 미리보기·HTML/프레젠테이션 다운로드가 동작한다.
 * (단, 로컬 파일 목록 조회·디스크 직접 저장·폴더 선택 기능은 서버 연계 시에만 사용 가능)
 */
function Module2App() {
  const [activeSubTab, setActiveSubTab] = useState<'write' | 'design-system'>('write');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      <header className="bg-slate-900 border-b border-slate-800 text-slate-100 px-6 py-4 flex flex-col md:flex-row items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-blue-500 shrink-0" />
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white">Creative Spark V2.0 — 가이드북 컴파일러 & 배색 빌더</h1>
            <div className="text-xs text-slate-400 font-semibold tracking-wider">모듈 2 · 연계형 저작 도구 (서버 미연결 시 클라이언트 컴파일 폴백)</div>
          </div>
          <span className="ml-2 bg-emerald-400/25 text-emerald-200 border border-emerald-400/30 text-xs px-2 py-0.5 rounded-full font-bold">
            Standalone
          </span>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <div className="space-y-4">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveSubTab('write')}
              className={`px-6 py-3 text-xs font-bold border-b-2 transition-all ${
                activeSubTab === 'write'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              1. 가이드북 마크다운 작성 & 컴파일
            </button>
            <button
              onClick={() => setActiveSubTab('design-system')}
              className={`px-6 py-3 text-xs font-bold border-b-2 transition-all ${
                activeSubTab === 'design-system'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              2. 디자인 시스템 조율 & 배색 빌더 (styles.json)
            </button>
          </div>

          {activeSubTab === 'write' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-0.5 flex items-center gap-1.5">
                  <PenTool className="h-4 w-4 text-blue-600" />
                  <span>가이드북 마크다운 작성 및 빌드</span>
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mt-1">
                  마크다운 에디터와 split-pane 실시간 프리뷰를 제공합니다. 서버가 연결되지 않은 standalone 모드에서는 브라우저 내장 컴파일러로 미리보기 및 HTML/프레젠테이션 다운로드가 동작합니다.
                </p>
              </div>
              <ErrorBoundary label="마크다운 가이드북 컴파일러">
                <MarkdownCompiler />
              </ErrorBoundary>
            </div>
          )}

          {activeSubTab === 'design-system' && (
            <div className="space-y-4">
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-0.5 flex items-center gap-1.5">
                  <Sliders className="h-4 w-4 text-blue-600" />
                  <span>디자인 시스템 테마 조율 & 커스텀 배색 빌더</span>
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mt-1">
                  기존 스타일 프리셋의 HSL 색상 변수를 미세 튜닝하거나, 사용자가 직접 메인·서브·강조 배색 조합을 기획하고 WCAG 대비 검증을 마친 후 신규 테마로 등록합니다.
                </p>
              </div>
              <ErrorBoundary label="디자인 시스템 배색 빌더">
                <VisualAdjuster />
              </ErrorBoundary>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

const mountApp = () => {
  const root = document.getElementById('root');
  if (root) {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <Module2App />
      </React.StrictMode>
    );
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
