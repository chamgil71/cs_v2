import { useState } from 'react';
import LayoutList from './LayoutList';
import LayoutDetail from './LayoutDetail';
import LayoutPreview from './LayoutPreview';
import { LAYOUT_ENTRIES, DEFAULT_SHAPE_SET, exampleVariants } from '../../lib/layout-library';
import { BUNDLED_STYLES } from '../../lib/client-compiler';

/**
 * 모듈 1 — 본문 레이아웃 라이브러리 (2026-10-14, 인계서 D)
 * 공용 본문 레이아웃 카탈로그 전부를 그룹·검색으로 찾고, 카탈로그 예시를 실제 렌더러로 미리 보며(테마·서식 세트·인수 변형),
 * 구현 상태(cs_v2 HTML·PPTX / pptgen)·항목 칸·본문 레이아웃 인수·스니펫을 한 화면에서 본다.
 * pptgen `layout-views`(views/layouts.pptx)와 같은 예시 — 웹과 pptx 미리보기가 같은 출처.
 */
export default function LayoutLibrary() {
  const [group, setGroup] = useState('');
  const [query, setQuery] = useState('');
  const [name, setName] = useState(LAYOUT_ENTRIES[0].name);
  const entry = LAYOUT_ENTRIES.find((e) => e.name === name) || LAYOUT_ENTRIES[0];
  const [args, setArgs] = useState(exampleVariants(entry)[0]);
  const [style, setStyle] = useState(Object.keys(BUNDLED_STYLES)[0]);
  const [shape, setShape] = useState(DEFAULT_SHAPE_SET);
  const [mode, setMode] = useState<'html' | 'presentation'>('html');
  const select = (n: string) => {
    const e = LAYOUT_ENTRIES.find((x) => x.name === n);
    setName(n);
    if (e) setArgs(exampleVariants(e)[0]);
  };
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-4">
      <LayoutList group={group} query={query} selected={name} onGroup={setGroup} onQuery={setQuery} onSelect={select} />
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-4 min-w-0">
        <LayoutPreview entry={entry} args={args} style={style} shape={shape} mode={mode}
          onArgs={setArgs} onStyle={setStyle} onShape={setShape} onMode={setMode} />
        <LayoutDetail entry={entry} args={args} />
      </div>
    </div>
  );
}
