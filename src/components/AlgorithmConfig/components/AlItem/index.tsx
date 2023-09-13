import React from 'react';
import { AlItemProps } from '../../interface';
import DescriptionInput from '../DescriptionInput';

const AlItem = ({ mT, sT, alValue, onAlChange, description, ...alOther }: AlItemProps) => {
  return (
    <div className="alItem">
      <div className="alTitle">
        <div className="mT">{mT}</div>
        <div className="sT">{sT}</div>
      </div>
      <DescriptionInput description={description} value={alValue} onChange={onAlChange} {...alOther} />
    </div>
  );
};

export default AlItem;
