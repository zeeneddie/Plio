import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';
import { emailTemplateData } from '../../canvas/helpers';

export default {
  field: 'percentOfRevenue',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          '% of revenue set to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '% of revenue changed from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '% of revenue removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set % of revenue of {{{docDesc}}} {{{docName}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed % of revenue of {{{docDesc}}} {{{docName}}} ' +
          'from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed % of revenue of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs: { percentOfRevenue: { newValue, oldValue } } }) {
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
