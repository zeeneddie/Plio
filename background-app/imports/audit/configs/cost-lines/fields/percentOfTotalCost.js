import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';
import { emailTemplateData } from '../../canvas/helpers';

export default {
  field: 'percentOfTotalCost',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          '% of total cost set to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '% of total cost changed from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '% of total cost removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set % of total cost of {{{docDesc}}} {{{docName}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed % of total cost of {{{docDesc}}} {{{docName}}} ' +
          'from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed % of total cost of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs: { percentOfTotalCost: { newValue, oldValue } } }) {
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
