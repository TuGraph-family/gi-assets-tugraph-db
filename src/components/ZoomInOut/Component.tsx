import React, { useEffect } from 'react';
import { useContext } from '@antv/gi-sdk';
import { Minimap, Graph } from '@antv/g6';
import { useImmer } from 'use-immer';

import './index.less';

const animateCfg = { duration: 200, easing: 'easeCubic' };

const ZoomInOut = () => {
  const { graph } = useContext();
  const [state, setState] = useImmer<{
    visible: boolean;
  }>({
    visible: true,
  });
  useEffect(() => {
    const minimap = new Minimap({
      size: [57.5, 32.5],
      container: 'minimap',
      className: 'minimapWrap',
    });
    graph.addPlugin(minimap);
    console.log(graph);
  }, []);
  if (!state.visible) return null;
  return (
    <div className="zoomInOut">
      <div className="map">
        <div id="minimap"></div>
        <div
          className="hide"
          onClick={() => {
            setState({ visible: false });
          }}
        ></div>
      </div>
      <div className="toolbar">
        <div
          className="zoomOut"
          onClick={() => {
            graph.zoom(1.2, undefined, true, animateCfg);
          }}
        ></div>
        <div
          className="zoomIn"
          onClick={() => {
            graph.zoom(0.8, undefined, true, animateCfg);
          }}
        ></div>
        <div
          className="realZoom"
          onClick={() => {
            graph.zoomTo(1, undefined, true, animateCfg);
          }}
        ></div>
        <div
          className="autoZoom"
          onClick={() => {
            graph.fitView(20, undefined, true, animateCfg);
          }}
        ></div>
      </div>
    </div>
  );
};

export default ZoomInOut;
