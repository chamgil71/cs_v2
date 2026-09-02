import { useState } from 'react';
import JSZip from 'jszip';
import { HelpCircle, FileCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { scanPptxColors, applyPptxColorRemap } from '@/lib/pptx-color-remap';
import PptxUploadZone from './PptxUploadZone';
import ColorMappingTable from './ColorMappingTable';

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// SubUtilities 섹션 3: 초경량 PPTX 컬러 리매퍼 (일괄 색상 강제 교체)
export default function PptxColorRemapper() {
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [slideCount, setSlideCount] = useState<number>(0);
  const [detectedColors, setDetectedColors] = useState<Array<{ hex: string; count: number }>>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultName, setResultName] = useState('');

  const handleRemapperUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setLoading(true);
    setStatusMessage('PPTX 파일 로드 및 색상 검사 중...');

    try {
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);
      const { slideCount: count, colors } = await scanPptxColors(zip);

      setSlideCount(count);
      setDetectedColors(colors);

      const initialMap: Record<string, string> = {};
      colors.forEach(item => { initialMap[item.hex] = item.hex; });
      setMappings(initialMap);

      toast({
        title: 'PPTX 분석 완료',
        description: `총 ${count}개 슬라이드에서 ${colors.length}개의 색상을 감지했습니다.`,
      });
    } catch (err: any) {
      toast({ title: '파일 분석 실패', description: err.message, variant: 'destructive' });
      setFile(null);
    } finally {
      setLoading(false);
      setStatusMessage('');
    }
  };

  const handleRemapChange = (fromHex: string, toHex: string) => {
    const cleanTo = toHex.replace('#', '').toUpperCase();
    if (cleanTo.length === 6 && /^[0-9A-Fa-f]{6}$/.test(cleanTo)) {
      setMappings(prev => ({ ...prev, [fromHex]: cleanTo }));
    } else {
      setMappings(prev => ({ ...prev, [fromHex]: toHex }));
    }
  };

  const handleRunRemap = async () => {
    if (!file) return;
    setLoading(true);
    setStatusMessage('PPTX 내부 XML 색상 치환 가공 중...');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);
      const result = await applyPptxColorRemap(zip, mappings);

      if (!result) {
        toast({ title: '알림', description: '변경된 매핑 정보가 없거나 올바르지 않습니다.' });
        return;
      }

      const outName = file.name.replace(/\.pptx?$/i, '') + '_색상변경.pptx';
      setResultBlob(result.blob);
      setResultName(outName);
      downloadBlob(result.blob, outName);

      toast({
        title: '변환 및 다운로드 완료',
        description: `총 ${result.changedFiles}개 XML에서 ${result.totalReps}개의 색상이 교체되었습니다.`,
      });
    } catch (err: any) {
      toast({ title: '변환 실패', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
      setStatusMessage('');
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
          <HelpCircle className="h-4 w-4 text-blue-500" /> 3. 초경량 PPTX 컬러 리매퍼 (일괄 색상 강제 교체)
        </h3>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-900 leading-relaxed">
          <strong>초경량 PPTX 컬러 리매퍼란?</strong><br />
          이 도구는 가이드 문서 변환과는 관련이 없는 **단독 보조 유틸리티**입니다.
          기존에 작성된 일반 파워포인트(PPTX) 파일을 업로드하여, 그 안에 쓰인 특정 구형 색상(예: 옛날 회사 로고색, 원색 빨강 등)을 사용자가 원하는 세련된 신규 색상으로 **PPTX 내부 XML 상에서 1:1 강제 일괄 치환**해 줍니다.
        </div>
      </div>

      {!file ? (
        <PptxUploadZone onUpload={handleRemapperUpload} />
      ) : (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center justify-between flex-wrap gap-2 text-sm">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-blue-600" />
              <div>
                <strong className="text-blue-900">{file.name}</strong>
                <span className="text-blue-600 block text-xs mt-0.5">슬라이드: {slideCount}개 | 검출 색상: {detectedColors.length}개</span>
              </div>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setDetectedColors([]);
                setResultBlob(null);
              }}
              className="text-xs text-slate-500 hover:text-slate-800 underline"
            >
              다른 파일 올리기
            </button>
          </div>

          <ColorMappingTable
            detectedColors={detectedColors}
            mappings={mappings}
            loading={loading}
            statusMessage={statusMessage}
            resultBlob={resultBlob}
            resultName={resultName}
            onRemapChange={handleRemapChange}
            onRedownload={() => resultBlob && downloadBlob(resultBlob, resultName)}
            onRunRemap={handleRunRemap}
          />
        </div>
      )}
    </div>
  );
}
