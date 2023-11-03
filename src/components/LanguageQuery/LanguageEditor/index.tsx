import React, { forwardRef } from 'react';
import CypherEdit from './cypherEditor';

interface Props {
  language?: 'ISOGQL' | 'Gremlin';
  initialValue?: string;
  isReadOnly?: boolean;
  width?: string | number;
  height?: string | number;
  graphId?: string;
  onChange?: (content: string) => void;
  gremlinId?: string;
}

export const GraphEditor: React.FC<Props, any> = forwardRef<any, any>(
  (props, editorRef) => {
    const {
      height = '100%',
      width,
      initialValue = '',
      graphId = 'default-editor',
      language,
    } = props;
    return (
      <div style={{ width, height, borderRadius: 8 }}>
        <CypherEdit
          ref={editorRef}
          value={initialValue}
          height={height}
          showGutter={false}
          language={language}
        />
      </div>
    );
  }
);

export default GraphEditor;
