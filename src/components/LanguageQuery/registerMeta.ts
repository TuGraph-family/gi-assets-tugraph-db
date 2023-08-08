import { extra } from "@antv/gi-sdk";
const { GIAC_CONTENT_METAS, deepClone } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);

const registerMeta = (context) => {
  const { services } = context;
  const serviceOptions = services.map((c) => {
    return {
      value: c.id,
      label: c.id
    };
  });

  return {
    /** 分类信息 */
    languageServiceId: {
      title: "数据服务",
      type: "string",
      "x-decorator": "FormItem",
      "x-component": "Select",
      "x-component-props": {
        options: serviceOptions
      },
      default: "TuGraph-DB/languageQueryService"
    },
    ...metas
  };
};

export default registerMeta;
