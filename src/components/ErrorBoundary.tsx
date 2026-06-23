import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  /** 경계 내부에서 오류 발생 시 표시할 도구 이름 (예: "PPTX 디자인 인스펙터") */
  label?: string;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * 자식 컴포넌트 트리에서 발생한 런타임 예외를 포착하여
 * 전체 화면이 빈 화면이 되는 것을 막고 복구 UI를 제공하는 경계 컴포넌트.
 * 외부 의존성 없이 React 표준 에러 경계 API(getDerivedStateFromError/componentDidCatch)로 구현.
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // 개발 단계 디버깅을 위한 콘솔 출력 (프로덕션 로깅 도입 시 이 지점을 교체)
    console.error('[ErrorBoundary] 렌더링 중 오류가 포착되었습니다:', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const { label } = this.props;
      return (
        <div
          role="alert"
          aria-live="assertive"
          className="bg-white border border-red-200 rounded-xl p-8 shadow-sm flex flex-col items-center text-center gap-3"
        >
          <AlertTriangle className="h-10 w-10 text-red-500" aria-hidden="true" />
          <div>
            <h2 className="text-base font-bold text-slate-800">
              {label ? `${label} 화면을 표시하는 중 오류가 발생했습니다` : '오류가 발생했습니다'}
            </h2>
            <p className="text-slate-500 text-sm mt-1 leading-relaxed">
              일시적인 문제일 수 있습니다. 아래 버튼으로 다시 시도하거나 페이지를 새로고침해 주세요.
            </p>
          </div>
          {this.state.error?.message && (
            <pre className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 max-w-full overflow-auto text-left">
              {this.state.error.message}
            </pre>
          )}
          <div className="flex gap-2 mt-1">
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>다시 시도</span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
            >
              새로고침
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
