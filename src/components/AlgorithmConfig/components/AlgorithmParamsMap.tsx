import React from 'react';
import AlItem from './AlItem';

const AlgorithmParamsMap = (props) => {
  return (
    <>
      <AlItem
        mT="src_id"
        sT="(起点ID)"
        alValue={props?.value?.src_id}
        description="同类型ID不能重复"
        onAlChange={(alValue: any) => {
          props?.onChange({ ...props?.value, src_id: alValue?.target?.value });
        }}
      />
      <AlItem
        mT="target_id"
        sT="(目标ID)"
        alValue={props?.map?.target_id}
        description="同类型ID不能重复"
        onAlChange={(alValue: any) => {
          props?.onChange({
            ...props?.value,
            target_id: alValue?.target?.value,
          });
        }}
      />
      <AlItem
        mT="iterations"
        sT="(迭代轮数)"
        alValue={props?.value?.iterations}
        description=""
        onAlChange={(alValue: any) => {
          props?.onChange({
            ...props?.value,
            iterations: alValue?.target?.value,
          });
        }}
      />
    </>
  );
};

export default AlgorithmParamsMap;
