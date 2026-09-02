import ContrastChecker from './sub-utilities/ContrastChecker';
import ThemePresetBuilder from './sub-utilities/ThemePresetBuilder';
import PptxColorRemapper from './sub-utilities/PptxColorRemapper';

export default function SubUtilities() {
  return (
    <div className="space-y-6 text-slate-800">
      <ContrastChecker />
      <ThemePresetBuilder />
      <PptxColorRemapper />
    </div>
  );
}
