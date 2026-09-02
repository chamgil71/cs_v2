import { useThemeEditor } from '@/hooks/useThemeEditor';
import ThemePresetPanel from './visual-adjuster/ThemePresetPanel';
import ThemeEditorPanel from './visual-adjuster/ThemeEditorPanel';
import ThemeLivePreviewPanel from './visual-adjuster/ThemeLivePreviewPanel';

export default function VisualAdjuster() {
  const {
    styles,
    selectedStyle,
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
  } = useThemeEditor();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-slate-800">
      <ThemePresetPanel
        styles={styles}
        selectedStyle={selectedStyle}
        loading={loading}
        hasServer={hasServer}
        newThemeKey={newThemeKey}
        onNewThemeKeyChange={setNewThemeKey}
        onSelectStyle={handleSelectStyle}
        onDeleteTheme={handleDeleteTheme}
        onRefresh={fetchStyles}
        onAddNewTheme={startNewTheme}
        onSaveToServer={handleSaveStylesToServer}
      />
      <ThemeEditorPanel
        selectedStyle={selectedStyle}
        themeForm={themeForm}
        onFormChange={handleFormChange}
        onSaveEdit={handleAddOrEditTheme}
      />
      <ThemeLivePreviewPanel themeForm={themeForm} selectedStyle={selectedStyle} />
    </div>
  );
}
