import { RiskTypes } from '/imports/share/collections/risk-types';
import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../../problems/helpers';


export default {
  field: 'typeId',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Risk type set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Risk type changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Risk type removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set type of {{{docDesc}}} {{{docName}}} to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed type of {{{docDesc}}} {{{docName}}} from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed type of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs: { typeId } }) {
    const { newValue, oldValue } = typeId;

    const getRiskTypeTitle = (_id) => {
      const { title } = RiskTypes.findOne({ _id }) || {};
      return title;
    };

    return {
      newValue: () => getRiskTypeTitle(newValue),
      oldValue: () => getRiskTypeTitle(oldValue),
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
