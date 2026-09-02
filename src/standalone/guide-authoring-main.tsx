import React from 'react';
import ReactDOM from 'react-dom/client';
import { PenTool, Sparkles } from 'lucide-react';
import '../index.css';
import MarkdownCompiler from '../components/MarkdownCompiler';
import ErrorBoundary from '../components/ErrorBoundary';

/**
 * 모듈 2 단독 패키지 — 가이드북 마크다운 컴파일러
 *
 * 원래 Vite API 미들웨어 서버와 연계되는 도구이나, 서버가 없는 standalone 환경에서는
 * MarkdownCompiler 내부의 클라이언트 사이드 컴파일러(client-compiler.ts) 폴백으로
 * 미리보기·HTML/프레젠테이션 다운로드가 동작한다.
 * (단, 로컬 파일 목록 조회·디스크 직접 저장·폴더 선택 기능은 서버 연계 시에만 사용 가능)
 * 테마 조율은 모듈 1(디자인 시스템)로 분리되었다 — design-system.html 참고.
 */
function GuideAuthoringApp() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      <header className="bg-slate-900 border-b border-slate-800 text-slate-100 px-6 py-4 flex flex-col md:flex-row items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-blue-500 shrink-0" />
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white">Creative Spark V2.0 — 가이드북 저작</h1>
            <div className="text-xs text-slate-400 font-semibold tracking-wider">모듈 2 · 연계형 저작 도구 (서버 미연결 시 클라이언트 컴파일 폴백)</div>
          </div>
          <span className="ml-2 bg-emerald-400/25 text-emerald-200 border border-emerald-400/30 text-xs px-2 py-0.5 rounded-full font-bold">
            Standalone
          </span>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
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
      </main>
    </div>
  );
}

const mountApp = () => {
  const root = document.getElementById('root');
  if (root) {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <GuideAuthoringApp />
      </React.StrictMode>
    );
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
