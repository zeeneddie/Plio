import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


const getGuidelinesConfig = (field, guidelineType, label) => {
  return {
    field: `${field}.${guidelineType}`,
    logs: [
      {
        message: {
          [ChangesKinds.FIELD_ADDED]:
            `Guidelines for ${label} set`,
          [ChangesKinds.FIELD_CHANGED]:
            `Guidelines for ${label} changed`,
          [ChangesKinds.FIELD_REMOVED]:
            `Guidelines for ${label} removed`
        }
      }
    ],
    notifications: [
      {
        text: {
          [ChangesKinds.FIELD_ADDED]:
            `{{userName}} set guidelines for ${label} in {{{docDesc}}} {{{docName}}}`,
          [ChangesKinds.FIELD_CHANGED]:
            `{{userName}} changed guidelines for ${label} in {{{docDesc}}} {{{docName}}}`,
          [ChangesKinds.FIELD_REMOVED]:
            `{{userName}} removed guidelines for ${label} in {{{docDesc}}} {{{docName}}}`
        }
      }
    ],
    data({ newDoc, user }) {
      const auditConfig = this;

      return {
        docDesc: () => auditConfig.docDescription(newDoc),
        docName: () => auditConfig.docName(newDoc),
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
