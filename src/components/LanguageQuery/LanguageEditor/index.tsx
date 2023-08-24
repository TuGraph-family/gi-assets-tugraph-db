import GremlinEditor from 'ace-gremlin-editor';
import React, { forwardRef } from "react";

interface Props {
  language?: "ISOGQL" | "Gremlin";
  initialValue?: string;
  isReadOnly?: boolean;
  width?: string | number;
  height?: string | number;
  graphId?: string;
  onChange?: (content: string) => void;
  gremlinId?: string;
}


export const GraphEditor: React.FC<Props> = forwardRef((props) => {
  const {
    height = "100%",
    width,
    onChange,
    initialValue = '',
    graphId = 'default-editor'
  } = props;

  return <div style={{ width, height, borderRadius: 8 }}>
    <GremlinEditor
      gremlinId={graphId}
      initValue={initialValue}
      height={height}
      showGutter={false}
      onValueChange={(val) => {
        if (onChange) {
          onChange(val)
        }
      }}
    />
  </div>;
});

export default GraphEditor;
