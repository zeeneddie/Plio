import { RiskTypes } from '/imports/share/collections/risk-types.js';
import { ChangesKinds } from '../../../utils/changes-kinds.js';


export default {
  field: 'typeId',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'risks.fields.typeId.added',
        [ChangesKinds.FIELD_CHANGED]: 'risks.fields.typeId.changed',
        [ChangesKinds.FIELD_REMOVED]: 'risks.fields.typeId.removed',
      }
    }
  ],
  notifications: [],
  data({ diffs: { typeId } }) {
    const { newValue, oldValue } = typeId;

    const getRiskTypeTitle = (_id) => {
      const { title } = RiskTypes.findOne({ _id }) || {};
      return title;
    };

    return {
      newValue: () => getRiskTypeTitle(newValue),
      oldValue: () => getRiskTypeTitle(oldValue)
    };
  }
};
