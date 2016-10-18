import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


const getGuidelinesConfig = (field, guidelineType, label) => {
  return {
    field: `${field}.${guidelineType}`,
    logs: [],
    notifications: [
      {
        text: {
          [ChangesKinds.FIELD_CHANGED]:
            `{{userName}} changed guidelines for ${label} in {{{docDesc}}}`
        }
      }
    ],
    data({ newDoc, user }) {
      const auditConfig = this;

      return {
        docDesc: () => auditConfig.docDescription(newDoc),
        userName: () => getUserFullNameOrEmail(user)
      };
    },
    receivers: getReceivers
  };
};

export default [
  getGuidelinesConfig('ncGuidelines', 'minor', 'minor non-conformities'),
  getGuidelinesConfig('ncGuidelines', 'major', 'major non-conformities'),
  getGuidelinesConfig('ncGuidelines', 'critical', 'critical non-conformities'),
  getGuidelinesConfig('rkGuidelines', 'minor', 'minor risks'),
  getGuidelinesConfig('rkGuidelines', 'major', 'major risks'),
  getGuidelinesConfig('rkGuidelines', 'critical', 'critical risks')
];
