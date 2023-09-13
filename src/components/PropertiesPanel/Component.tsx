import React from 'react';
import './index.less';

export interface props {
  data?: any;
  propertyInfos: { propertyName: string; ratio: number }[];
}

const PropertiesPanel: React.FC<props> = props => {
  const { data, propertyInfos = [] } = props;
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  let content;
  if (data) {
    content = Object.keys(data).map(key => {
      let value = data[key];

      return {
        key,
        value,
      };
    });
  }

  return (
    <div className="propertiesDetail">
      <div className="information">
        <ul>
          <li style={{ fontWeight: 500, fontSize: 14, color: 'rgba(26,27,37,0.88)' }}>属性信息</li>
          {content?.map(item => {
            const { key, value } = item;
            return (
              <li key={key}>
                <span style={{ fontSize: 14, color: 'rgba(26,27,37,0.88)' }}>{key}：</span>
                <span style={{ fontSize: 12, color: '#ccc' }}>{value}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default PropertiesPanel;
