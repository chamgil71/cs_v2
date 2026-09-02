import { Upload } from 'lucide-react';

interface PptxUploadZoneProps {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// SubUtilities 섹션 3: 파일 미선택 상태의 드래그&드롭/파일선택 업로드존
export default function PptxUploadZone({ onUpload }: PptxUploadZoneProps) {
  return (
    <div className="border-2 dashed border-slate-200 bg-slate-50 rounded-xl p-8 text-center space-y-3">
      <Upload className="h-8 w-8 text-slate-400 mx-auto" />
      <div>
        <strong className="text-sm text-slate-700 block">색상을 변경할 PPTX 파일 드래그 & 드롭</strong>
        <span className="text-xs text-slate-400 block mt-1">파일은 서버로 가거나 외부로 전송되지 않고 브라우저 로컬에서 안전하게 변환됩니다.</span>
      </div>
      <label className="inline-block bg-blue-600 hover:bg-blue-600 text-white font-semibold text-sm px-4 py-2 rounded transition-colors shadow-sm cursor-pointer">
        파일 선택
        <input type="file" onChange={onUpload} accept=".pptx" className="hidden" />
      </label>
    </div>
  );
}
