export const DefaultColor = [
  "rgb(64 137 255)",
  "rgb(204 116 255)",
  "rgb(6 184 168)",
  "rgb(255 136 52)",
  "rgb(88 136 195)",
  "rgb(250 115 205)",
  "rgb(7 188 224)",
  // "#faad14"
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
        value: "∈"
      },
      {
        key: "NC",
        value: "∉"
      },
      {
        key: "EQ",
        value: "="
      },
      {
        key: "NE",
        value: "≠"
      }
    ];
  }

  if (type === "long" || type === "double" || type === 'int32') {
    return [
      {
        key: "GT",
        value: ">"
      },
      {
        key: "LT",
        value: "<"
      },
      {
        key: "EQ",
        value: "="
      },
      {
        key: "NE",
        value: "≠"
      },
      {
        key: "GE",
        value: "≥"
      },
      {
        key: "LE",
        value: "≤"
      }
    ];
  }

  if (type === "boolean") {
    return [
      {
        key: "EQ",
        value: "="
      },
      {
        key: "NE",
        value: "≠"
      }
    ];
  }
  return [];
};