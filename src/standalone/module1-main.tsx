import React from 'react';
import ReactDOM from 'react-dom/client';
import { BarChart3, Sparkles } from 'lucide-react';
import '../index.css';
import PptxInspectorSuite from '../components/PptxInspectorSuite';
import ErrorBoundary from '../components/ErrorBoundary';

/**
 * 모듈 1 단독 패키지 — PPTX 디자인 인스펙터 & 리매퍼
 * 외부 서버 API 없이 브라우저 내에서 100% 서버리스로 완결 동작한다.
 */
function Module1App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      <header className="bg-slate-900 border-b border-slate-800 text-slate-100 px-6 py-4 flex flex-col md:flex-row items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-blue-500 shrink-0" />
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white">Creative Spark V2.0 — PPTX 디자인 인스펙터</h1>
            <div className="text-xs text-slate-400 font-semibold tracking-wider">모듈 1 · 단독 구동형 (서버리스)</div>
          </div>
          <span className="ml-2 bg-emerald-400/25 text-emerald-200 border border-emerald-400/30 text-xs px-2 py-0.5 rounded-full font-bold">
            Standalone
          </span>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              <span>PPTX 디자인 인스펙터 & 튜너</span>
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              업로드한 PPTX 파일의 XML 구조를 해체하여 디자인 사양(색상/폰트/레이아웃)을 벤치마킹 분석하고, 특정 구형 색상을 XML 1:1 리매핑하여 강제 일괄 치환해 줍니다.
              <span className="text-blue-600 font-bold ml-1">이 도구는 외부 서버 API 없이 브라우저 내에서 100% 서버리스로 가공·완결되어 독립 동작합니다.</span>
            </p>
          </div>
          <ErrorBoundary label="PPTX 디자인 인스펙터">
            <PptxInspectorSuite />
          </ErrorBoundary>
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
        <Module1App />
      </React.StrictMode>
    );
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
