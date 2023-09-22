import { useContext } from "@antv/gi-sdk";
import { Form, Tooltip } from "antd";
import debounce from "lodash/debounce";
import React, { useCallback, useEffect } from "react";
import { useImmer } from "use-immer";
import graphLayoutConfig, { LayoutConfig, LayoutItem } from "./config";
import "./index.less";

const defaultValue = {};

const defSpringLen = (_edge, source, target) => {
  const defaultSpring = 100;
  const Sdegree = source.data.layout.degree;
  const Tdegree = target.data.layout.degree;
  const MinDegree = Math.min(Sdegree, Tdegree);

  let SpringLength = defaultSpring;
  if (MinDegree < 5) {
    SpringLength = defaultSpring * MinDegree;
  } else {
    SpringLength = 500;
  }

  return SpringLength;
};

const LayoutContent = () => {
  const [form] = Form.useForm();

  const { updateContext, graph, config } = useContext();

  const [state, setState] = useImmer<{
    currentLayout: LayoutConfig;
    layoutConfigMap: Record<string, LayoutConfig>;
    currentLayoutType: string;
    content: JSX.Element[];
    layoutTipInfo: {
      text: any;
      icon: any;
    };
  }>({
    currentLayout: graphLayoutConfig["force2"],
    layoutConfigMap: graphLayoutConfig,
    currentLayoutType: "force2",
    content: [],
    layoutTipInfo: {
      text: graphLayoutConfig["force2"].title,
      icon: graphLayoutConfig["force2"].icon
    }
  });

  const { currentLayout, layoutConfigMap, currentLayoutType, content, layoutTipInfo } = state;

  // 根据 Graph 的大小更新一遍默认系数
  useEffect(() => {
    if (graph) {
      const gWidth = graph.get("width");
      const gHeight = graph.get("height");
      const gWidthHalf = gWidth / 2;
      const gHeightHalf = gHeight / 2;
      const resetLayoutConfig = Object.keys(layoutConfigMap).reduce((map, key) => {
        const layoutConfig = layoutConfigMap[key];
        const newItems = layoutConfig.items.map((item: LayoutItem) => {
          switch (item.label) {
            case "center":
              return {
                ...item,
                defaultValue: [gWidthHalf, gHeightHalf]
              };
            case "width":
              return {
                ...item,
                defaultValue: gWidth
              };
            case "height":
              return {
                ...item,
                defaultValue: gHeight
              };
            case "radius":
              return {
                ...item,
                defaultValue: Math.max(50, Math.min(gHeightHalf - 50, gWidthHalf - 50))
              };
            default:
              return item;
          }
        });
        map[key] = {
          ...layoutConfigMap[key],
          items: newItems
        };
        return map;
      }, {} as Record<string, LayoutConfig>);
  
      setState((draft) => {
        draft.layoutConfigMap = resetLayoutConfig;
      });
      form.setFieldsValue(defaultValue);
    }
  }, []);

  useEffect(() => {
    const layoutId = config.layout.id.toLowerCase()
    handleToggleLayout(layoutId)
    setState(draft => {
      draft.currentLayoutType = layoutId
      draft.layoutTipInfo = {
        text: graphLayoutConfig[layoutId].title,
        icon: graphLayoutConfig[layoutId].icon,
      }
    })
  }, [config.layout])

  // 切换布局
  const handleToggleLayout = (value, modifying = true) => {
    if (value) {
      setState((draft) => {
        draft.currentLayoutType = value;
      });
    }
    if (layoutConfigMap[value]) {
      const currentConfig = layoutConfigMap[value];
      setState((draft) => {
        draft.currentLayout = layoutConfigMap[value];
      });

      setState((draft) => {
        draft.layoutTipInfo = {
          text: currentConfig.title,
          icon: currentConfig.icon
        };
      });
      if (!modifying) {
        // 只是初始化改变内容，不重新计算布局
        return;
      }
      // 从当前布局中获取所有默认参数
      const configs = layoutConfigMap[value].items;
      if (configs) {
        const defaultLayoutConfigs = {};
        configs.forEach((d) => {
          defaultLayoutConfigs[d.label] = d.defaultValue;
        });
      }
    }
  };

  // 更新布局参数
  const updateLayoutConfig = (changedField, allFields, layoutType) => {
    const currentFileds = Object.assign({}, allFields, changedField);
    Object.keys(currentFileds).forEach((key) => {
      defaultValue[key] = currentFileds[key];
    });
    const { x, y, ...others } = currentFileds;
    const config = others;
    if (layoutType === "grid" || layoutType === "dagre") {
      config.begin = [x, y];
    } else {
      config.center = [x, y];
    }
    if (!config.sweep) config.sweep = undefined;
    if (!config.nodeSize) config.nodeSize = undefined;
    updateContext((draft) => {
      draft.config.layout = {
        id: layoutType,
        props: {
          type: layoutType,
          ...config,
          animation: false,
          defSpringLen
        }
      };
    });
    form.setFieldsValue(defaultValue);
  };

  // 更新布局参数需要 debounce，使用 callback 来限流
  const debounceChange = useCallback(
    debounce(
      (changedField, allFields, layoutType) =>
        updateLayoutConfig(changedField, allFields, layoutType),
      currentLayoutType === "force2" ? 1000 : 500
    ),
    []
  );

  /**
   * 当字段值改变后，自动更新布局
   * @param changedFiled 改变了的字段
   * @param allFields 所有字段
   */
  const handleFieldValueChange = (changedField, allFields) => {
    // 限流，防止频繁重新布局
    debounceChange(changedField, allFields, currentLayoutType);
  };

  // 选中的布局类型变化时，更新布局参数界面、改变默认参数、
  useEffect(() => {
    const currentContent = currentLayout.items.map((item: LayoutItem, index: number) => {
      const { component: Component, isSwitch, defaultValue: value, labelZh, ...otherProps } = item;
      const key = `${currentLayout.title}-${index}`;
      defaultValue[item.label] = item.defaultValue;
      if (item.label === "center" || item.label === "begin") {
        if (item.defaultValue) {
          defaultValue["x"] = item.defaultValue[0];
          defaultValue["y"] = item.defaultValue[1];
        }
      }
      return (
        <Form.Item
          name={item.label}
          key={key}
          label={
            <Tooltip
              title={<span style={{ color: "rgba(0, 0, 0, 0.85)" }}>{item.description}</span>}
              color='rgb(255 ,255 ,255)'
            >
              <span>{labelZh}</span>
            </Tooltip>
          }
          valuePropName={isSwitch ? "checked" : undefined}
        >
          {isSwitch ? (
            <Component defaultChecked={value} {...otherProps} />
          ) : (
            <Component {...otherProps} />
          )}
        </Form.Item>
      );
    });
    form.setFieldsValue(defaultValue);

    setState((draft) => {
      draft.content = currentContent;
    });
  }, [currentLayoutType]);

  return (
    <div className='layoutContainer'>
      <div style={{ fontWeight: "bold", color: "rgba(0, 0, 0, 0.85)" }}>{layoutTipInfo.text}</div>
      <div className='contentContainer'>
        <div className='blockContainer'>
          <Form
            form={form}
            name={`${currentLayoutType}-config-form`}
            initialValues={defaultValue}
            onValuesChange={(changedField, allFields) => {
              handleFieldValueChange(changedField, allFields);
            }}
          >
            {content}
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LayoutContent;
