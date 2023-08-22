export default context => {

  const { services } = context;
  const serviceOptions = services.map((c) => {
    return {
      value: c.id,
      label: c.id
    };
  });

  return {
    serviceId: {
      title: '数据服务',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      default: 'TuGraph-DB/neighborsQueryService',
      'x-component-props': {
        options: serviceOptions,
      },
    },
    languageServiceId: {
      title: "高级数据服务",
      type: "string",
      "x-decorator": "FormItem",
      "x-component": "Select",
      "x-component-props": {
        options: serviceOptions
      },
      default: "TuGraph-DB/languageQueryService"
    },
  };
};
