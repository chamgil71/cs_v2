import type { Dispatch, SetStateAction } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { ThemeDetails } from './theme-defaults';

interface UseThemeMutationsArgs {
  styles: Record<string, ThemeDetails>;
  setStyles: Dispatch<SetStateAction<Record<string, ThemeDetails>>>;
  selectedStyle: string;
  setSelectedStyle: (key: string) => void;
  editingThemeKey: string | null;
  setEditingThemeKey: (key: string | null) => void;
  newThemeKey: string;
  setNewThemeKey: (key: string) => void;
  themeForm: ThemeDetails;
  setThemeForm: (form: ThemeDetails) => void;
  hasServer: boolean | null;
}

// 테마 추가/수정/삭제/서버 저장 — 로컬 상태 편집(add/edit/delete) 및 styles.json 영구 저장(save) 로직.
export function useThemeMutations({
  styles,
  setStyles,
  selectedStyle,
  setSelectedStyle,
  editingThemeKey,
  setEditingThemeKey,
  newThemeKey,
  setNewThemeKey,
  themeForm,
  setThemeForm,
  hasServer,
}: UseThemeMutationsArgs) {
  const { toast } = useToast();

  const handleAddOrEditTheme = () => {
    if (editingThemeKey) {
      setStyles(prev => ({ ...prev, [editingThemeKey]: { ...themeForm } }));
      toast({
        title: "테마 임시 수정 완료",
        description: `"${themeForm.label}" 테마가 로컬 상태에서 수정되었습니다. [서버에 최종 저장]을 눌러 반영하세요.`,
      });
      return;
    }

    const key = newThemeKey.trim().toLowerCase();
    if (!key) {
      toast({ title: "입력 오류", description: "새 테마 키(ID)를 입력해 주세요.", variant: "destructive" });
      return;
    }
    if (styles[key]) {
      toast({ title: "중복 오류", description: "이미 존재하는 테마 키(ID)입니다.", variant: "destructive" });
      return;
    }
    if (!themeForm.label.trim()) {
      toast({ title: "입력 오류", description: "테마 한글명을 입력해 주세요.", variant: "destructive" });
      return;
    }
    setStyles(prev => ({ ...prev, [key]: { ...themeForm } }));
    setSelectedStyle(key);
    setEditingThemeKey(key);
    setNewThemeKey("");
    toast({
      title: "테마 임시 추가 완료",
      description: `"${themeForm.label}" 테마가 로컬 상태에 추가되었습니다. [서버에 최종 저장]을 눌러 반영하세요.`,
    });
  };

  const handleDeleteTheme = (keyToDelete: string) => {
    if (keyToDelete === "sky-blue" || keyToDelete === "emerald") {
      toast({ title: "삭제 불가능", description: "기본 테마는 삭제할 수 없습니다.", variant: "destructive" });
      return;
    }
    const newStyles = { ...styles };
    delete newStyles[keyToDelete];
    setStyles(newStyles);

    if (selectedStyle === keyToDelete) {
      const first = Object.keys(newStyles)[0] || "sky-blue";
      setSelectedStyle(first);
      if (newStyles[first]) setThemeForm({ ...newStyles[first] });
    }

    toast({
      title: "테마 임시 삭제 완료",
      description: "테마가 로컬 상태에서 삭제되었습니다. [서버에 최종 저장]을 눌러 반영하세요.",
    });
  };

  const handleSaveStylesToServer = async () => {
    if (hasServer === false) {
      toast({
        title: "서버 미연결",
        description: "styles.json 서버 저장은 로컬 개발 서버(npm run dev)가 실행 중일 때만 사용할 수 있습니다.",
        variant: "destructive",
      });
      return;
    }
    try {
      const res = await fetch("/api/save-styles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ styles }),
      });
      if (res.ok) {
        toast({
          title: "서버 저장 성공",
          description: "모든 테마 변경사항이 styles.json에 완벽히 저장되었습니다.",
        });
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to save styles");
      }
    } catch (err: any) {
      toast({ title: "서버 저장 실패", description: err.message, variant: "destructive" });
    }
  };

  return { handleAddOrEditTheme, handleDeleteTheme, handleSaveStylesToServer };
}
