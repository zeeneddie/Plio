import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';
import { emailTemplateData } from '../../canvas/helpers';

export default {
  field: 'percentOfProfit',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          '% of profit set to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '% of profit changed from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '% of profit removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set % of profit of {{{docDesc}}} {{{docName}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed % of profit of {{{docDesc}}} {{{docName}}} ' +
          'from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed % of profit of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs: { percentOfProfit: { newValue, oldValue } } }) {
    return {
      newValue: () => `${newValue}%`,
      oldValue: () => `${oldValue}%`,
    };
  },
  emailTemplateData,
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
