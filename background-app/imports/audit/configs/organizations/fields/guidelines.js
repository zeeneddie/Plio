import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';


const getGuidelinesConfig = (field, magnitude, relatedDocs) => {
  return {
    field: `${field}.${magnitude}`,
    logs: [
      {
        message: {
          [ChangesKinds.FIELD_ADDED]:
            'Guidelines for {{relatedDocs}} set',
          [ChangesKinds.FIELD_CHANGED]:
            'Guidelines for {{relatedDocs}} changed',
          [ChangesKinds.FIELD_REMOVED]:
            'Guidelines for {{relatedDocs}} removed',
        },
      },
    ],
    notifications: [
      {
        text: {
          [ChangesKinds.FIELD_ADDED]:
            '{{userName}} set guidelines for {{relatedDocs}} in {{{docDesc}}} {{{docName}}}',
          [ChangesKinds.FIELD_CHANGED]:
            '{{userName}} changed guidelines for {{relatedDocs}} in {{{docDesc}}} {{{docName}}}',
          [ChangesKinds.FIELD_REMOVED]:
            '{{userName}} removed guidelines for {{relatedDocs}} in {{{docDesc}}} {{{docName}}}',
        },
      },
    ],
    data() {
      return { relatedDocs };
    },
    receivers({ newDoc, user }) {
      return getReceivers(newDoc, user);
    },
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
