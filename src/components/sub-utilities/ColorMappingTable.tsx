import { RefreshCw, CheckCircle, Download } from 'lucide-react';

interface DetectedColor {
  hex: string;
  count: number;
}

interface ColorMappingTableProps {
  detectedColors: DetectedColor[];
  mappings: Record<string, string>;
  loading: boolean;
  statusMessage: string;
  resultBlob: Blob | null;
  resultName: string;
  onRemapChange: (fromHex: string, toHex: string) => void;
  onRedownload: () => void;
  onRunRemap: () => void;
}

// SubUtilities 섹션 3: 감지된 색상 → 타겟 색상 매핑 테이블 + 진행 상태/결과/실행 버튼
export default function ColorMappingTable({
  detectedColors,
  mappings,
  loading,
  statusMessage,
  resultBlob,
  resultName,
  onRemapChange,
  onRedownload,
  onRunRemap,
}: ColorMappingTableProps) {
  return (
    <div className="space-y-4">
      <div className="border border-slate-200 rounded-lg overflow-hidden max-h-[300px] overflow-y-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <th className="p-3">감지된 원래 색상 (From)</th>
              <th className="p-3">사용 빈도</th>
              <th className="p-3">변경할 타겟 색상 (To)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {detectedColors.map((item) => (
              <tr key={item.hex} className="hover:bg-slate-50/50">
                <td className="p-3 flex items-center gap-2">
                  <div className="w-5.5 h-5.5 rounded border border-slate-200" style={{ backgroundColor: `#${item.hex}` }} />
                  <strong className="font-mono text-slate-800">#{item.hex}</strong>
                </td>
                <td className="p-3 font-semibold text-slate-500">
                  {item.count}회 사용됨
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={mappings[item.hex] ? (mappings[item.hex].startsWith('#') ? mappings[item.hex] : `#${mappings[item.hex]}`) : `#${item.hex}`}
                      onChange={(e) => onRemapChange(item.hex, e.target.value)}
                      className="w-6 h-6 p-0.5 border border-slate-200 rounded cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={mappings[item.hex] || item.hex}
                      onChange={(e) => onRemapChange(item.hex, e.target.value)}
                      placeholder="HEX 코드"
                      className="border border-slate-200 rounded px-2 py-1 text-sm font-mono uppercase text-slate-800 w-24 focus:outline-none focus:border-blue-500"
                    />
                    {mappings[item.hex] !== item.hex && (
                      <button
                        onClick={() => onRemapChange(item.hex, item.hex)}
                        className="text-xs text-slate-400 hover:text-red-500 transition-colors"
                        title="초기화"
                      >
                        복원
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {loading && (
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg flex items-center gap-3.5 text-sm text-slate-600">
          <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
          <span>{statusMessage}</span>
        </div>
      )}

      {resultBlob && (
        <div className="bg-emerald-50 border border-emerald-100 p-3.5 rounded-lg flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-2.5">
            <CheckCircle className="h-4.5 w-4.5 text-emerald-600" />
            <div>
              <strong>색상 변경 파일 다운로드 완료!</strong>
              <span className="block text-[10px] text-emerald-600 mt-0.5">다운로드가 차단되었을 경우 우측 재다운로드 버튼을 클릭해 주세요.</span>
            </div>
          </div>
          <button
            onClick={onRedownload}
            className="bg-emerald-600 hover:bg-emerald-550 text-white font-semibold px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
          >
            <Download className="h-3.5 w-3.5" /> 재다운로드
          </button>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={onRunRemap}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-550 text-white font-semibold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
        >
          <Download className="h-4 w-4" /> 리매핑 일괄 실행 및 다운로드
        </button>
      </div>
    </div>
  );
}
