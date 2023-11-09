// @ts-nocheck
import React, { forwardRef } from 'react';
import { MonacoEnvironment, EditorProvider } from '@difizen/cofine-editor-core';

const Editor = forwardRef<any, any>((props, editorRef) => {
  const { value, onCreated, onChange, language } = props;
  let codeEditor: monaco.editor.IStandaloneCodeEditor;

  // 监听事件
  let erdElement: HTMLElement | null;

  const installElementResizeDetector = () => {
    // eslint-disable-next-line react/no-find-dom-node
    const node = editorRef && editorRef.current;
    const parentNode = node && node.parentElement;
    erdElement = parentNode;
  };

  React.useEffect(() => {
    MonacoEnvironment.loadModule(async (container: { load: (arg0: Syringe.Module) => void }) => {
      const dsl = await import('@difizen/cofine-language-cypher');
      container.load(dsl.default);
    });
    MonacoEnvironment.init().then(async () => {
      if (editorRef && editorRef.current) {
        const editorProvider =
          MonacoEnvironment.container.get<EditorProvider>(EditorProvider);
        const editor = editorProvider.create(editorRef.current, {
          language: 'cypher',
          value,
          theme: 'cypherTheme',
          suggestLineHeight: 24,
          suggestLineHeight: 24,
          automaticLayout: true,
          minimap: { enabled: false },
          fontSize: 14,
          lineHeight: 20,
          folding: true,
          wordWrap: 'on',
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 3,
          readOnly: false,
          hover: {
            delay: 800,
          },
          suggestSelection: 'first',
          wordBasedSuggestions: false,
          suggest: { snippetsPreventQuickSuggestions: false },
          autoClosingQuotes: 'always',
          fixedOverflowWidgets: true,
          'bracketPairColorization.enabled': true,
        });

        editorRef.current.codeEditor = codeEditor = editor.codeEditor;
        installElementResizeDetector();

        if (onCreated) {
          onCreated(editor.codeEditor);
        }
        // registerOptions({});
      }
    });

    return () => {
      if (codeEditor) {
        codeEditor.dispose();
      }
    };
  }, [editorRef]);

  return (
    <div
      ref={editorRef}
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  );
});

export default Editor;
