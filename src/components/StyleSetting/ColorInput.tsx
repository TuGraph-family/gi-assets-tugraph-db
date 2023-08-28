import { EditOutlined } from "@ant-design/icons";
import { Popover, Tooltip, Button } from "antd";
import React, { useEffect } from "react";
import { SketchPicker } from "react-color";
import { useImmer } from "use-immer";
import "./index.less";

const advanceColors = [
  '#cb962a',
  '#23ad61',
  '#ff8075'
]

export interface ColorInputProps {
  value?: any;
  defaultValue?: string;
  onChange?: (rgbaValue: string, originValue?: any) => void;
}

const ColorInput: React.FC<ColorInputProps> = ({ onChange, value, defaultValue }) => {
  const [state, setState] = useImmer<{ color?: string }>({ color: defaultValue });
  const { color } = state;
  useEffect(() => {
    setState((draft) => {
      draft.color = value;
    });
  }, [value]);
  return (
    <div className='color-input'>
      <Popover
        trigger='click'
        overlayClassName='color-input-popover'
        content={
          <SketchPicker
            color={color}
            onChangeComplete={(color) => {
              const { rgb } = color;
              const { r, g, b, a } = rgb;
              setState((draft) => {
                draft.color = `rgba(${r}, ${g}, ${b}, ${a})`;
              });

              if (onChange) {
                onChange(`rgba(${r}, ${g}, ${b}, ${a})`, color);
              }
            }}
          />
        }
      >
        <Tooltip title='自定义颜色'>
          {/* <EditOutlined /> */}
          <div className="custom-color-btn">...</div>
        </Tooltip>
      </Popover>
    </div>
  );
};

export default ColorInput;
