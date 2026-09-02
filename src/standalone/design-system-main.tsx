import React from 'react';
import ReactDOM from 'react-dom/client';
import { Palette, Sparkles } from 'lucide-react';
import '../index.css';
import DesignSystemSuite from '../components/DesignSystemSuite';
import ErrorBoundary from '../components/ErrorBoundary';

/**
 * 모듈 1 단독 패키지 — 디자인 시스템 (테마 조율 & 보조 유틸리티)
 * VisualAdjuster/SubUtilities는 /api/list-styles·/api/save-styles를 호출하지만,
 * 서버가 없는 standalone 환경에서는 각자 내장된 폴백 프리셋으로 조회만 동작하고
 * 저장(styles.json 등록)은 서버 연계 모드에서만 가능하다.
 */
function DesignSystemApp() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      <header className="bg-slate-900 border-b border-slate-800 text-slate-100 px-6 py-4 flex flex-col md:flex-row items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-blue-500 shrink-0" />
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white">Creative Spark V2.0 — 디자인 시스템</h1>
            <div className="text-xs text-slate-400 font-semibold tracking-wider">모듈 1 · 단독 구동형 (저장은 서버 연계 모드 전용)</div>
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
              <Palette className="h-4 w-4 text-blue-600" />
              <span>디자인 시스템 — 테마 조율 & 보조 유틸리티</span>
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              HSL 색상 변수를 미세 튜닝하거나 직접 배색을 기획하고, 대비 검사기·팔레트 빌더·컬러 리매퍼로 검증합니다.
            </p>
          </div>
          <ErrorBoundary label="디자인 시스템">
            <DesignSystemSuite />
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
        <DesignSystemApp />
      </React.StrictMode>
    );
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
