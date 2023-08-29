import type { IGIAC } from '@antv/gi-sdk';
import { extra, useContext } from '@antv/gi-sdk';
import React, { memo, useState } from 'react';

import Desscription from './Description';
const { GIAComponent } = extra;
export interface IProps {
  GIAC: IGIAC;
}

const TuGraphShortcutKeys: React.FunctionComponent<IProps> = props => {
  const { GIAC } = props;
  
  const { GISDK_ID } = useContext();
  const [isModalOpen, setIsModalOpen] = useState(GIAC.visible);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <GIAComponent GIAC={GIAC} onClick={showModal} />
      <Desscription isModalOpen={isModalOpen} handleOk={handleOk} handleCancel={handleCancel} />
    </>
  );
};

export default memo(TuGraphShortcutKeys);
