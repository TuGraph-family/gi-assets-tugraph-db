import { extra } from "@antv/gi-sdk";
const { deepClone, GIAC_CONTENT_METAS } = extra;
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
    languageServiceId: {
      title: "数据查询服务",
      type: "string",
      "x-decorator": "FormItem",
      "x-component": "Select",
      "x-component-props": {
        options: serviceOptions
      },
      default: "TuGraph-DB/configQueryService"
    },
    schemaServiceId: {
      title: 'Schema服务',
      type: "string",
      "x-decorator": "FormItem",
      "x-component": "Select",
      "x-component-props": {
        options: serviceOptions
      },
      default: 'TuGraph-DB/graphSchemaService'
    },
    ...metas
  };
};

export default registerMeta;
