import { useState } from 'react';
import { Palette, Wrench } from 'lucide-react';
import VisualAdjuster from './VisualAdjuster';
import SubUtilities from './SubUtilities';

/**
 * 모듈 1 — 디자인 시스템
 * VisualAdjuster(HSL 테마 조율·styles.json 등록)와 SubUtilities(대비 검사기·
 * 커스텀 배색 빌더·컬러 리매퍼)를 하나의 모듈로 묶는다. 콘텐츠 작성(모듈 2)에
 * 들어가기 전에 먼저 확정하는 기초 작업이라는 워크플로 순서를 반영한다.
 */
export default function DesignSystemSuite() {
  const [tab, setTab] = useState<'theme' | 'utilities'>('theme');

  return (
    <div className="space-y-4">
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setTab('theme')}
          className={`px-6 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            tab === 'theme'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Palette className="h-4 w-4" />
          테마 조율 & 배색 빌더
        </button>
        <button
          onClick={() => setTab('utilities')}
          className={`px-6 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            tab === 'utilities'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Wrench className="h-4 w-4" />
          보조 유틸리티 (대비 검사기 · 팔레트 빌더 · 컬러 리매퍼)
        </button>
      </div>

      {tab === 'theme' ? <VisualAdjuster /> : <SubUtilities />}
    </div>
  );
}
