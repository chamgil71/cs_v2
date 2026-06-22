/**
 * editor-box.mjs
 * 코드 에디터 시뮬레이터 숏코드
 */

export const type = "editor-box";

export function estimateHeight(item, w, D, helpers) {
  const c = D.card;
  return item.items.reduce((sum, it) => {
    const codeLines = (it.desc || "").split("\n");
    // 한 줄당 대략 0.2" 할당 + 타이틀바 0.35" + 상하 여백 0.3"
    const editorH = 0.35 + Math.max(0.6, codeLines.length * 0.19) + 0.3;
    return sum + editorH + c.gap;
  }, 0);
}

export function render(slide, item, x, y, w, pal, D, helpers) {
  const c = D.card;
  const font = D.slide.font;
  const mono = D.slide.fontMono || "Consolas";
  const r = D.slide.globalRadius || 0.08;
  
  let curY = y;
  
  for (const it of item.items) {
    const codeLines = (it.desc || "").split("\n");
    const editorH = 0.35 + Math.max(0.6, codeLines.length * 0.19) + 0.3;
    
    // 1. 에디터 외부 라운드 박스 (다크 테마 배경)
    slide.addShape("roundRect", {
      x, y: curY, w, h: editorH,
      rectRadius: r,
      fill: { color: "0F172A" }, // 매우 어두운 남색
      line: { color: pal.border, width: 0.75 }
    });
    
    // 2. 상단 타이틀바 채우기
    const titleBarH = 0.35;
    slide.addShape("roundRect", {
      x, y: curY, w, h: titleBarH,
      rectRadius: r,
      fill: { color: "1E293B" }, // 약간 밝은 어두운 회색
      line: { width: 0 }
    });
    // 타이틀바 하단 둥근 모서리 덮어쓰기 (아래 둥근 부분 깎아내기)
    slide.addShape("rect", {
      x, y: curY + titleBarH - 0.08, w, h: 0.08,
      fill: { color: "1E293B" },
      line: { width: 0 }
    });
    
    // 3. 맥 OS 윈도우 도트 3개 그리기
    const dotY = curY + (titleBarH - 0.08) / 2;
    const dotColors = ["EF4444", "F59E0B", "10B981"]; // 빨, 노, 초
    dotColors.forEach((color, idx) => {
      slide.addShape("ellipse", {
        x: x + 0.14 + idx * 0.15, y: dotY,
        w: 0.08, h: 0.08,
        fill: { color },
        line: { width: 0 }
      });
    });
    
    // 4. 에디터 탭 파일명 및 언어 표시
    const filename = it.title || "untitled";
    const lang = it.tag || "javascript";
    const tabLabel = `${filename} (${lang})`;
    
    slide.addText(tabLabel, {
      x: x + 0.75, y: curY, w: w - 1.0, h: titleBarH,
      fontSize: 9.5, bold: true, color: "CDD6F4",
      fontFace: mono, valign: "middle"
    });
    
    // 5. 좌측 라인 넘버 영역 그리기 (본문 왼쪽 0.45" 너비의 약간 다른 톤의 세로 띠)
    const lineNumW = 0.45;
    const contentY = curY + titleBarH;
    const contentH = editorH - titleBarH;
    
    slide.addShape("rect", {
      x, y: contentY, w: lineNumW, h: contentH,
      fill: { color: "0D1321", transparency: 20 },
      line: { width: 0 }
    });
    
    // 라인 번호 텍스트 생성 (1\n2\n3\n...)
    const numText = codeLines.map((_, i) => String(i + 1)).join("\n");
    slide.addText(numText, {
      x: x + 0.05, y: contentY + 0.12, w: lineNumW - 0.1, h: contentH - 0.2,
      fontSize: 8.5, color: "565F89", // 회회색
      fontFace: mono, align: "right", valign: "top", wrap: false
    });
    
    // 6. 소스코드 텍스트 출력
    slide.addText(it.desc || "", {
      x: x + lineNumW + 0.15, y: contentY + 0.12, w: w - lineNumW - 0.25, h: contentH - 0.2,
      fontSize: 8.5, color: "A9B1D6", // 연한 하늘색/회색 텍스트
      fontFace: mono, valign: "top", wrap: true
    });
    
    curY += editorH + c.gap;
  }
  
  return curY - y;
}
