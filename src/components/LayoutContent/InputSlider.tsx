import React from "react";
import { InputNumber, Slider } from "antd";

const InputSlider = ({ value, onChange, min, max }) => {
  const valueMin = !isNaN(min) ? min : 2;
  const valueMax = !isNaN(max) ? max : 100;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row"
      }}
    >
      <Slider
        min={valueMin}
        max={valueMax}
        onChange={onChange}
        value={typeof value === "number" ? value : valueMin}
        style={{ flex: 1 }}
      ></Slider>
      <InputNumber
        min={valueMin}
        max={valueMax}
        style={{ width: "60px" }}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default InputSlider;
