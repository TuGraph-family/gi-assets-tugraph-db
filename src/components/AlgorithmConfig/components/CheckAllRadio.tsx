import { Checkbox, Space } from 'antd';
import React from 'react';
import {
  CheckAllRadioProps,
  CheckboxChangeEvent,
  CheckboxValueType,
  Label,
} from '../interface';

const CheckboxGroup = Checkbox.Group;

const CheckAllRadio = ({
  value,
  defaultValue,
  onChange,
  checkAllVisible = true,
  ...other
}: CheckAllRadioProps) => {
  const checkAll = defaultValue?.length === value?.length;
  const indeterminate =
    value && value?.length > 0 && value?.length < defaultValue?.length;
  return (
    <>
      <Space direction="vertical">
        {checkAllVisible ? (
          <Checkbox
            indeterminate={indeterminate}
            checked={checkAll}
            onChange={(e: CheckboxChangeEvent) => {
              onChange &&
                onChange(
                  e.target.checked
                    ? defaultValue?.map(
                      // @ts-ignore
                        (item: Label | CheckboxValueType) => item?.value
                      )
                    : []
                );
            }}
          >
            以下全部类型
          </Checkbox>
        ) : null}
        <CheckboxGroup
          {...other}
          options={defaultValue}
          value={value}
          onChange={onChange}
        />
      </Space>
    </>
  );
};

export default CheckAllRadio;
