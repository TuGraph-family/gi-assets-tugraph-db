import { ArrowLeftOutlined } from '@ant-design/icons';
import { extra, useContext, utils } from '@antv/gi-sdk';
import { Button } from 'antd';
import * as React from 'react';
import { useImmer } from 'use-immer';

import './index.less';

const { GIAC_PROPS } = extra;

export interface Back {
  visible: boolean;
  color: string;
  hasDivider: boolean;
  GIAC: any;
  serviceId: string;
}

const Back: React.FunctionComponent<Back> = props => {
  const { services } = useContext();
  const service = utils.getService(services, props.serviceId);

  const appId = utils.searchParamOf('appId');

  if (!service) {
    return null;
  }

  const [state, setState] = useImmer<{
    backInfo: { title: string; href: string; toPreVersion: boolean };
  }>({
    backInfo: {
      title: 'NOT FUND',
      href: '',
      toPreVersion: false,
    },
  });
  const queryInfo = async () => {
    const res = await service();
    setState(draft => {
      draft.backInfo = {
        title: res.title,
        href: res.href,
        toPreVersion: res.toPreVersion,
      };
    });
  };

  React.useEffect(() => {
    queryInfo();
  }, []);

  const { backInfo } = state;
  const { href, toPreVersion } = backInfo;

  return (
    <div className="gea-back">
      {!appId && (
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => {
            location.href = href;
          }}
        ></Button>
      )}

      <>
        <span className="gea-back-text" style={{ paddingLeft: appId ? 20 : 0, fontWeight: '600' }}>
          {backInfo.title}
        </span>
      </>
    </div>
  );
};

export default Back;
