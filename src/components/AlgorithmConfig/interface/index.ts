import { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import type { IGIAC } from '@antv/gi-sdk';
import { CheckboxProps, InputProps, SelectProps } from 'antd';

export interface IProps {
  GIAC: IGIAC;
}
export interface Label {
  label: string;
  value: string;
  disabled?: boolean;
  defaultChecked?: boolean;
}
export interface CheckAllRadioProps extends Partial<CheckboxProps> {
  checkAllVisible?: boolean;
  value?: string[];
  defaultValue: any[];
  onChange?: (value: CheckboxValueType[] | CheckboxChangeEvent | Label[]) => void;
}
export interface DescriptionInput extends InputProps {
  description: string;
}
export interface DescriptionSelect extends SelectProps {
  description: string;
}
export interface RootConfig {
  modalOpen: boolean;
  width: number;
  modalTitle: string;
  actionType: string;
  actionId: string;
  actionFormData: any;
}
export interface DataType {
  algorithmId: string;
  name: string;
  algorithmName: string;
  executionStatus: 'running' | 'stop';
  algorithmExecutionTime: string;
  creator: string;
  createTime: string;
}
export interface AlItemProps extends DescriptionInput {
  mT: string;
  sT: string;
  alValue: string | number | undefined;
  onAlChange: (value: any) => void;
}

export interface LinksFn {
  goAdd?: () => void;
  goList?: () => void;
  goDetails?: (id: string, other?: any) => void;
  goResult?: (id: string, other?: any) => void;
  name?: string;
  id?: string;
  goEdit?: (id: string, other?: any) => void;
}

export { CheckboxChangeEvent, CheckboxValueType, IGIAC, CheckboxProps, InputProps, SelectProps };
