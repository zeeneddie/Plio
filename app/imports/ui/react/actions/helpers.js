import { ActionTypes } from '/imports/share/constants';
import { equals } from '/imports/api/helpers';

export const splitActionsByType = (actions) => {
  const map = {
    [ActionTypes.CORRECTIVE_ACTION]: [],
    [ActionTypes.PREVENTATIVE_ACTION]: [],
    [ActionTypes.RISK_CONTROL]: [],
  };

  return actions.reduce((prev, cur) => {
    const key = Object.keys(prev).find(equals(cur.type));

    return key ? ({
      ...prev,
      [key]: [
        ...prev[key],
        cur,
      ],
    }) : ({ ...prev });
  }, map);
};
