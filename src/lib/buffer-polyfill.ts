// 브라우저(standalone/오프라인) 환경용 Node Buffer 폴리필.
// gray-matter 가 frontmatter 파싱 시 Buffer.from 을 호출하는데, Vite 빌드는 node "buffer" 를
// externalize 하므로 브라우저에 Buffer 전역이 없다 → matter() 가 throw → 미리보기/PPTX 가 빈 채로 실패.
// 이 모듈을 gray-matter 사용 경로(client-compiler, pptx-browser) 최상단에서 import 하여 전역을 보강한다.
// Node(테스트/CLI)에서는 이미 Buffer 가 존재하므로 건드리지 않는다.
import { Buffer as PolyfillBuffer } from 'buffer';

if (typeof (globalThis as any).Buffer === 'undefined') {
  (globalThis as any).Buffer = PolyfillBuffer;
}
