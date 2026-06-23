import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // 검사 대상에서 제외할 산출물 디렉토리
  { ignores: ["dist", "dist-pptx", "publish", "storage", "node_modules"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      // 점진적 도입 단계: 기존 코드의 any/미사용 변수는 경고로 완화
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      // 정리(cleanup)용 빈 catch 블록은 의도된 패턴이므로 허용
      "no-empty": ["error", { allowEmptyCatch: true }],
      // 보안 정규식 내부의 명시적 이스케이프는 가독성 목적이므로 경고로 완화
      "no-useless-escape": "warn",
    },
  },
  // shadcn/ui 생성 컴포넌트: 템플릿 보일러플레이트 규칙 완화
  {
    files: ["src/components/ui/**/*.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
      "react-refresh/only-export-components": "off",
    },
  },
  // Node 환경에서 실행되는 빌드/유틸 스크립트 및 설정 파일
  {
    files: ["scripts/**/*.{js,mjs,ts}", "*.config.{js,ts}"],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },
);
