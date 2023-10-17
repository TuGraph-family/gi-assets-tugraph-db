import { useContext, type GIGraphData, Icon } from '@antv/gi-sdk';
import { Empty, message } from 'antd';
import React, { memo, useState } from 'react';
import Handler from './Handle';
import TimebarControl from './control';
import type { Aggregation, Speed, TimeGranularity } from './types';

type TimebarProps = {
  height: number;
  /** 时间范围(时间戳) */
  timeRange: [number, number];
  /** 默认范围 */
  defaultTimeLength?: 'all' | 'day' | 'month' | 'year';
  /** 时间字段 */
  timeField: string;
  /** 指标字段 */
  yField: string;
  /**
   * 时间粒度
   *
   * 为 number 时表示自定义时间粒度(ms)
   * @example 数据按天统计，那么时间粒度为: 'day'
   */
  timeGranularity: TimeGranularity;
  /** 倍速(每 1/speed 秒播放 timeGranularity 个) */
  speed: Speed;
  aggregation: Aggregation;
  /** 播放模式：过滤/高亮 */
  playMode: 'filter' | 'highlight' | 'show-hide';
};

const TuGraphTimebar: React.FC<TimebarProps> = ({
  height = 200,
  aggregation,
  timeField,
  yField,
  defaultTimeLength,
  timeGranularity,
  speed,
  playMode,
}) => {
  const { data: graphData } = useContext();
  
  if (graphData.nodes.length === 0) {
    return null
  }

  const [isExpanded, setIsExpanded] = useState(true);

  if (!timeField || !yField)
    return (
      <Empty
        description='请配置时间字段'
        style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      />
    );

  const [xType, _timeField] = timeField.split(':');
  const [yType, _yField] = yField.split(':');

  if (xType !== yType) {
    message.warning('请确保时间字段和指标字段同属于节点或边！');
    return null;
  }

  const toggleClick = () => {
    setIsExpanded(prev => !prev);
  };

  // 过滤出时间范围内的数据
  return (
    <div className='tugraph-timebar-container' style={{ width: '100%', height: isExpanded ? height : 5, background: '#f3f5f9' }}>
      <TimebarControl
        aggregation={aggregation}
        graphData={graphData as GIGraphData}
        speed={speed}
        timeField={_timeField}
        timeGranularity={timeGranularity}
        type={xType as any}
        yField={_yField}
        playMode={playMode}
        defaultTimeLength={defaultTimeLength}
      />
      <Handler
        type="bottom"
        handleClick={toggleClick}
        style={{
          borderColor: 'transparent transparent #f3f5f9 transparent ',
        }}
        icon={
          <Icon
            type="icon-shituxiala"
            style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)', cursor: 'pointer' }}
          />
        }
      />
    </div>
  );
};

export default memo(TuGraphTimebar)
