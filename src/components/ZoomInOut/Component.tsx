import React, { useEffect, useRef, RefObject } from 'react';
import { useContext } from '@antv/gi-sdk';
import { Minimap, Graph } from '@antv/g6';
import { useImmer } from 'use-immer';
import { throttle } from '@antv/util';

import './index.less';

const animateCfg = { duration: 200, easing: 'easeCubic' };

const ZoomInOut = () => {
  const { graph } = useContext();
  const nodeRef: any = useRef({
    timer: null,
    width: 140,
    height: 124,
    holdOn: false,
    drag: false,
    mapHeight: 92,
    toolbarHeight: 32,
    offsetX: 0,
    scale: 1,
    pull: 16,
  });
  const realNodeRef: RefObject<any> = useRef(null);

  const fn = throttle(
    (e) => {
      const upScale = e.clientX < nodeRef.current.offsetX;
      if (nodeRef.current.holdOn) {
        if (upScale) {
          nodeRef.current.scale = nodeRef.current.scale + 0.1;
          realNodeRef.current.style.transform = `scale(${nodeRef.current.scale})`;
          realNodeRef.current.style.bottom =
            (nodeRef.current.scale - 1) * 60 + nodeRef.current.pull + 'px';
          realNodeRef.current.style.right =
            (nodeRef.current.scale - 1) * 64 + nodeRef.current.pull + 'px';
        } else {
          nodeRef.current.scale = nodeRef.current.scale - 0.1;
          realNodeRef.current.style.transform = `scale(${nodeRef.current.scale})`;
          realNodeRef.current.style.bottom =
            (nodeRef.current.scale - 1) * 60 + nodeRef.current.pull + 'px';
          realNodeRef.current.style.right =
            (nodeRef.current.scale - 1) * 64 + nodeRef.current.pull + 'px';
        }
      }
    },
    60,
    {
      trailing: true,
    }
  );
  const [state, setState] = useImmer<{
    visible: boolean;
  }>({
    visible: false,
  });
  useEffect(() => {
    const minimap = new Minimap({
      size: [nodeRef.current.width / 2, nodeRef.current.mapHeight / 2],
      container: 'minimap',
      className: 'minimapWrap',
    });
    graph.addPlugin(minimap);
  }, [state.visible]);
  return (
    <div
      className="zoomInOut"
      ref={realNodeRef}
      draggable
      onMouseDown={() => {
        nodeRef.current.timer = setTimeout(() => {
          nodeRef.current.holdOn = true;
          realNodeRef.current.style.borderColor = '#3056e3';
        }, 1000);
      }}
      onMouseUp={() => {
        if (nodeRef.current.timer) {
          clearTimeout(nodeRef.current.timer);
        }
        nodeRef.current.holdOn = false;
        realNodeRef.current.style.borderColor = '#e9e9e9';
      }}
      onDragStart={(e) => {
        nodeRef.current.offsetX = e.clientX;
        nodeRef.current.drag = true;
      }}
      onDrag={(e) => {
        if (nodeRef.current.drag && nodeRef.current.holdOn) {
          fn(e);
        }
      }}
      onDragEnd={(e) => {
        nodeRef.current.drag = false;
        realNodeRef.current.style.borderColor = '#e9e9e9';
      }}
    >
      {!state.visible ? (
        <div className="map">
          <div id="minimap"></div>
        </div>
      ) : null}
      {state.visible ? (
        <div
          className="hide"
          style={{
            border: '1px solid #e9e9e9',
          }}
          onClick={() => {
            setState({ ...state, visible: false });
          }}
        ></div>
      ) : (
        <div
          className="show"
          onClick={() => {
            setState({ ...state, visible: true });
          }}
        ></div>
      )}
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
