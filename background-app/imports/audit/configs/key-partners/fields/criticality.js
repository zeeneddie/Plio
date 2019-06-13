import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';
import { emailTemplateData } from '../../canvas/helpers';

export default {
  field: 'criticality',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Criticality set to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Criticality changed from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Criticality removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set criticality of {{{docDesc}}} {{{docName}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed criticality of {{{docDesc}}} {{{docName}}} ' +
          'from {{{oldValue}}} to {{{newValue}}}',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed criticality of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs: { criticality: { newValue, oldValue } } }) {
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
