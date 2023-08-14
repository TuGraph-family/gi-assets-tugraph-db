export const DefaultColor = [
  "#87e8de",
  "#1890ff",
  "#52c41a",
  "#13c2c2",
  "#2f54eb",
  "#722ed1",
  "#eb2f96",
  "#faad14"
];

export const ICONS = [
  {
    key: "user",
    value: "icon-user"
  },
  {
    key: "team",
    value: "icon-team"
  },
  {
    key: "id card",
    value: "icon-idcard"
  },
  {
    key: "addteam",
    value: "icon-addteam"
  },
  {
    key: "contacts",
    value: "icon-contacts"
  },
  {
    key: "solution",
    value: "icon-solution"
  },
  {
    key: "error",
    value: "icon-error"
  },
  {
    key: "star",
    value: "icon-star"
  },
  {
    key: "woman",
    value: "icon-woman"
  },
  {
    key: "man",
    value: "icon-man"
  },
  {
    key: "YUAN",
    value: "icon-YUAN"
  },
  {
    key: "Dollar",
    value: "icon-Dollar"
  },
  {
    key: "bank",
    value: "icon-bank"
  },

  {
    key: "shop",
    value: "icon-shop"
  },

  {
    key: "carry out",
    value: "icon-carryout"
  },
  {
    key: "car",
    value: "icon-car"
  },
  {
    key: "heart",
    value: "icon-heart"
  },
  {
    key: "phone",
    value: "icon-phone"
  },

  {
    key: "unlock",
    value: "icon-unlock"
  },
  {
    key: "lock",
    value: "icon-lock"
  }
];



export const operatorMapping = {
  CT: "CONTAINS",
  NC: "CONTAINS",
  EQ: "=",
  NE: "<>",
  GT: ">",
  LT: "<",
  GE: ">=",
  LE: "<="
};

export const getOperatorList = (value: string = '') => {
  const type = value.toLowerCase()
  if (type === "string") {
    return [
      {
        key: "CT",
        value: "包括"
      },
      {
        key: "NC",
        value: "不包括"
      },
      {
        key: "EQ",
        value: "等于"
      },
      {
        key: "NE",
        value: "不等于"
      }
    ];
  }

  if (type === "long" || type === "double" || type === 'int32') {
    return [
      {
        key: "GT",
        value: "大于"
      },
      {
        key: "LT",
        value: "小于"
      },
      {
        key: "EQ",
        value: "等于"
      },
      {
        key: "NE",
        value: "不等于"
      },
      {
        key: "GE",
        value: "大于等于"
      },
      {
        key: "LE",
        value: "小于等于"
      }
    ];
  }

  if (type === "boolean") {
    return [
      {
        key: "EQ",
        value: "等于"
      },
      {
        key: "NE",
        value: "不等于"
      }
    ];
  }
  return [];
};