import { useContext } from '@antv/gi-sdk';
import React from 'react';
const Counter = props => {
  const { graph, data } = useContext();

  const nodes = data.nodes.length;
  const edges = data.edges.length;
  return (
    <div
      style={{
        position: 'absolute',
        top: '50px',
        left: '20px',
        background: 'red',
        padding: '20px',
      }}
    >
      TuGraph Assets
      <br />
      Nodes Countrrr: {nodes} <br />
      Edges Count: {edges}
    </div>
  );
};

export default Counter;
