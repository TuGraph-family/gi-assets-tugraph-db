import { SearchOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import React from 'react';

const SearchItem = ({ name }: { name: string }) => {
  return (
    <div className="searchItem">
      <Input />
      <div className="tool">
        <Button
          icon={<SearchOutlined color="#fff" rev="" />}
          type="primary"
          style={{ width: '80px' }}
        >
          搜索
        </Button>
        <Button style={{ width: '80px' }}>重置</Button>
      </div>
    </div>
  );
};

export default SearchItem;
