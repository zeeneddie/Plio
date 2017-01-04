import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '../../../utils/helpers';
import { getReceivers } from '../helpers';


const getGuidelinesConfig = (field, magnitude, relatedDocs) => {
  return {
    field: `${field}.${magnitude}`,
    logs: [
      {
        message: {
          [ChangesKinds.FIELD_ADDED]: 'organizations.fields.guidelines.added',
          [ChangesKinds.FIELD_CHANGED]: 'organizations.fields.guidelines.changed',
          [ChangesKinds.FIELD_REMOVED]: 'organizations.fields.guidelines.removed',
        },
      },
    ],
    notifications: [
      {
        text: {
          [ChangesKinds.FIELD_ADDED]: 'organizations.fields.guidelines.text.added',
          [ChangesKinds.FIELD_CHANGED]: 'organizations.fields.guidelines.text.changed',
          [ChangesKinds.FIELD_REMOVED]: 'organizations.fields.guidelines.text.removed',
        },
      },
    ],
    data({ newDoc, user }) {
      const auditConfig = this;

      return {
        docDesc: () => auditConfig.docDescription(newDoc),
        docName: () => auditConfig.docName(newDoc),
        userName: () => getUserFullNameOrEmail(user),
        relatedDocs,
      };
    },
    receivers: getReceivers,
  };
};

export default [
  getGuidelinesConfig('ncGuidelines', 'minor', 'minor non-conformities'),
  getGuidelinesConfig('ncGuidelines', 'major', 'major non-conformities'),
  getGuidelinesConfig('ncGuidelines', 'critical', 'critical non-conformities'),
  getGuidelinesConfig('rkGuidelines', 'minor', 'minor risks'),
  getGuidelinesConfig('rkGuidelines', 'major', 'major risks'),
  getGuidelinesConfig('rkGuidelines', 'critical', 'critical risks'),
];
