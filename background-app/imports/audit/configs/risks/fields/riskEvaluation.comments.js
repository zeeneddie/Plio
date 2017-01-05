import { ChangesKinds } from '../../../utils/changes-kinds';


export default {
  field: 'riskEvaluation.comments',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'Risk evaluation comments set',
        [ChangesKinds.FIELD_CHANGED]: 'Risk evaluation comments changed',
        [ChangesKinds.FIELD_REMOVED]: 'Risk evaluation comments removed',
      },
    },
  ],
  notifications: [],
  data() { },
};
