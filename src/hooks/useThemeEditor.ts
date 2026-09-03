import { useState, useEffect } from 'react';
import { FALLBACK_STYLES } from '../lib/client-compiler';
import { type ThemeDetails, DEFAULT_THEME_FORM, NEW_THEME_TEMPLATE } from './theme-defaults';
import { useThemeMutations } from './useThemeMutations';

export type { ThemeDetails };

// 테마 프리셋 목록 로드·편집·저장 상태와 핸들러를 한 곳에서 관리 (VisualAdjuster 하위 3개 패널이 공유).
// 추가/수정/삭제/서버저장 로직 자체는 useThemeMutations 에 위임.
export function useThemeEditor() {
  const [styles, setStyles] = useState<Record<string, ThemeDetails>>({});
  const [selectedStyle, setSelectedStyle] = useState('sky-blue');
  const [editingThemeKey, setEditingThemeKey] = useState<string | null>(null);
  const [newThemeKey, setNewThemeKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasServer, setHasServer] = useState<boolean | null>(null);
  const [themeForm, setThemeForm] = useState<ThemeDetails>(DEFAULT_THEME_FORM);

  const fetchStyles = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/list-styles");
      if (res.ok) {
        const data = await res.json();
        setStyles(data);
        setHasServer(true);
        if (data[selectedStyle]) {
          setThemeForm({ ...data[selectedStyle] });
          setEditingThemeKey(selectedStyle);
        } else if (Object.keys(data).length > 0) {
          const firstKey = Object.keys(data)[0];
          setSelectedStyle(firstKey);
          setThemeForm({ ...data[firstKey] });
          setEditingThemeKey(firstKey);
        }
      } else {
        throw new Error("API unavailable");
      }
    } catch (err) {
      console.error("Failed to load styles, using fallback:", err);
      const data = FALLBACK_STYLES as Record<string, any>;
      setStyles(data);
      setHasServer(false);
      const firstKey = data[selectedStyle] ? selectedStyle : Object.keys(data)[0];
      if (firstKey) {
        setSelectedStyle(firstKey);
        setThemeForm({ ...data[firstKey] });
        setEditingThemeKey(firstKey);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStyles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectStyle = (key: string) => {
    setSelectedStyle(key);
    if (styles[key]) {
      setThemeForm({ ...styles[key] });
      setEditingThemeKey(key);
    }
  };

  const handleFormChange = (field: keyof ThemeDetails, val: string) => {
    setThemeForm(prev => ({ ...prev, [field]: val }));
  };

  const { handleAddOrEditTheme, handleDeleteTheme, handleSaveStylesToServer } = useThemeMutations({
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
  });

  const startNewTheme = () => {
    setEditingThemeKey(null);
    setThemeForm({ ...NEW_THEME_TEMPLATE });
    handleAddOrEditTheme();
  };

  return {
    styles,
    selectedStyle,
    editingThemeKey,
    newThemeKey,
    setNewThemeKey,
    loading,
    hasServer,
    themeForm,
    fetchStyles,
    handleSelectStyle,
    handleFormChange,
    handleAddOrEditTheme,
    handleDeleteTheme,
    handleSaveStylesToServer,
    startNewTheme,
  };
}
