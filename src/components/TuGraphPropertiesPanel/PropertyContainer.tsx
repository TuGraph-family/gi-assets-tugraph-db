// @ts-nocheck
import { CloseOutlined } from '@ant-design/icons';
import { utils, Icon } from '@antv/gi-sdk';
import { Button, Divider } from 'antd';
import React, { useState, useEffect } from 'react';
import { Resizable } from 're-resizable';
import Handler from './Handle';
import './propertiesContainer.less';

const POSITION_MAP = {
  LT: 'top',
  LB: 'left',
  RT: 'right',
  RB: 'bottom',
};

export interface ContainerTypeProps {
  containerWidth?: string;
  containerHeight?: string;
  containerPlacement: 'LT' | 'LB' | 'RT' | 'RB';
  children: any;
  visible: boolean;
  offset: number[];
  onClose: () => void;
  title: string;
  animate?: boolean;
}

const getDefaultPropertyWidth = () => {
  const defaultWidth = localStorage.getItem('TUGRAPH_PROPERTY_CONTAINER_WIDTH') || '320';
  return Number(defaultWidth);
};

const DivContainer: React.FunctionComponent<ContainerTypeProps> = props => {
  const { containerPlacement, children, visible, offset, onClose, title, animate } = props;

  const [isExpanded, setIsExpanded] = useState(true);
  const [width, setWidth] = useState(getDefaultPropertyWidth());
  const [isResizing, setIsResizing] = useState(false);
  const toggleClick = () => {
    setIsExpanded(prev => !prev);
  };

  useEffect(() => {
    if (isExpanded) {
      setWidth(getDefaultPropertyWidth());
      return;
    }
    setWidth(0);
  }, [isExpanded]);

  const enable = {
    top: false,
    right: false,
    bottom: false,
    left: true,
    topRight: false,
    bottomRight: false,
    bottomLeft: false,
    topLeft: false,
  };

  const styles = utils.getPositionStyles(containerPlacement, offset);
  if (containerPlacement === 'RT' || containerPlacement === 'LB') {
    styles.bottom = '4px';
    styles.top = '0px';
    styles.height = 'unset';
  }

  const ps = POSITION_MAP[containerPlacement];
  const classes = animate ? (visible ? `${ps} open` : `${ps} close`) : '';
  const displayStyle = animate
    ? {}
    : {
        display: visible ? 'block' : 'none',
      };
  const nodeRef = React.useRef(null);

  const DivContainer = (
    <div
      ref={nodeRef}
      style={{
        boxShadow: '6px 0 16px -8px rgb(0 0 0 / 8%), 9px 0 28px 0 rgb(0 0 0 / 5%), 12px 0 48px 16px rgb(0 0 0 / 3%)',
        cursor: 'default',
        ...styles,
        ...displayStyle,
        width: '100%',
      }}
      className={`divContainer tugraph-property-panel-div ${classes}`}
    >
      <div className="header">
        <div className="title"> {title}</div>
      </div>
      <Divider style={{ margin: 0 }} />
      <div className="body">{children}</div>
    </div>
  );

  const onResizeStart = () => {
    setIsResizing(true);
  };
  const onResizeStop = (e, direction, ref, d) => {
    setWidth(prev => {
      localStorage.setItem('GI_RICH_CONTAINER_SIDE_WIDTH', prev + d.width);
      return prev + d.width;
    });
    setIsResizing(false);
  };

  return (
    <div className="property-panel-container">
      <Resizable
        defaultSize={{ width }}
        style={{
          pointerEvents: 'all',
          backgroundColor: '#fff',
          // transition: 'width 5.3s ease 0s',
          zIndex: 10,
          // padding: '12px',
        }}
        // @ts-ignore
        size={{ width, height: '100%' }}
        enable={enable}
        onResizeStart={onResizeStart}
        onResizeStop={onResizeStop}
      >
        {DivContainer}
        <Handler
          type="right"
          handleClick={toggleClick}
          style={{
            borderColor: 'transparent #f3f5f9 transparent transparent ',
          }}
          icon={
            <Icon
              type="icon-shituxiala"
              style={{ transform: isExpanded ? 'rotate(-90deg)' : 'rotate(90deg)', cursor: 'pointer' }}
            />
          }
        />
      </Resizable>
    </div>
  );
};

export default DivContainer;
