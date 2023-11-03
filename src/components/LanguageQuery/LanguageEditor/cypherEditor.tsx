// @ts-nocheck
import React, { useState, forwardRef } from 'react';
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
      window.define = undefined;
    });

    return () => {
      if (codeEditor) {
        codeEditor.dispose();
      }
    };
  }, [editorRef]);

  const doFormat = (): Promise<boolean> => {
    if (!codeEditor) {
      Promise.resolve(false);
    }
    const selection = codeEditor.getSelection();
    const hasSelection = selection && !selection.isEmpty();
    const action = codeEditor.getAction(
      hasSelection
        ? 'editor.action.formatSelection'
        : 'editor.action.formatDocument'
    );
    if (action) {
      return new Promise((resolve, reject) => {
        action.run().then(
          () => {
            resolve(true);
          },
          (err: Error) => {
            reject(err);
          }
        );
      });
    }
    return Promise.reject(new Error('format not support'));
  };

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
