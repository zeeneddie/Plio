import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';
import { emailTemplateData } from '../../canvas/helpers';

export default {
  field: 'percentOfMarketSize',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          '% of market size set to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '% of market size changed from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '% of market size removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set % of market size of {{{docDesc}}} {{{docName}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed % of market size of {{{docDesc}}} {{{docName}}} ' +
          'from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed % of market size of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs: { percentOfMarketSize: { newValue, oldValue } } }) {
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
