import { Popover, Radio } from 'antd';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import './index.less';

const advanceColors = [
  // '#cb962a',
  // '#23ad61',
  // '#ff8075',
  // '#07bce0'
  'rgb(255 117 193)',
  'rgb(0 134 169)',
  'rgb(0 191 104)',
];

export interface ColorInputProps {
  value?: any;
  defaultValue?: string;
  onChange?: (e: any) => void;
}

const ColorInput: React.FC<ColorInputProps> = ({
  onChange,
  value,
  defaultValue,
}) => {
  const [state, setState] = useImmer<{ color?: string }>({
    color: defaultValue,
  });
  const { color } = state;
  useEffect(() => {
    setState((draft) => {
      draft.color = value;
    });
  }, [value]);
  return (
    <div className="color-input">
      <Popover
        trigger="click"
        overlayClassName="color-input-popover"
        content={
          <>
            <Radio.Group onChange={onChange}>
              {advanceColors.map((color, index) => (
                <Radio
                  className="custom-ant-radio-wrapper"
                  key={color}
                  value={color}
                  style={{
                    background: color,
                    marginRight: index === 3 ? 0 : 8,
                  }}
                />
              ))}
            </Radio.Group>
            {/* <SketchPicker
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
            /> */}
          </>
        }
      >
        <div className="custom-color-btn">...</div>
      </Popover>
    </div>
  );
};

export default ColorInput;
