import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers, emailTemplateData } from '../helpers';

export default {
  field: 'importance',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'Importance set to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Importance changed from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]: 'Importance removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set importance of {{{docDesc}}} "{{{docName}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed importance of {{{docDesc}}} "{{{docName}}}" ' +
          'from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed importance of {{{docDesc}}} "{{{docName}}}"',
      },
    },
  ],
  data({ diffs: { importance } }) {
    return {
      newValue: importance.newValue,
      oldValue: importance.oldValue,
    };
  },
  emailTemplateData,
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
