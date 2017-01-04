import { StandardsBookSections } from '/imports/share/collections/standards-book-sections';
import { ChangesKinds } from '../../../utils/changes-kinds';
import { getUserFullNameOrEmail } from '../../../utils/helpers';
import { getReceivers } from '../helpers';


export default {
  field: 'sectionId',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]: 'standards.fields.sectionId.added',
        [ChangesKinds.FIELD_CHANGED]: 'standards.fields.sectionId.changed',
        [ChangesKinds.FIELD_REMOVED]: 'standards.fields.sectionId.removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]: 'standards.fields.sectionId.text.added',
        [ChangesKinds.FIELD_CHANGED]: 'standards.fields.sectionId.text.changed',
        [ChangesKinds.FIELD_REMOVED]: 'standards.fields.sectionId.text.removed',
      },
    },
  ],
  data({ diffs: { sectionId }, newDoc, user }) {
    const auditConfig = this;
    const { newValue, oldValue } = sectionId;

    const getSectionTitle = (_id) => {
      const { title } = StandardsBookSections.findOne({ _id }) || {};
      return title;
    };

    return {
      docDesc: () => auditConfig.docDescription(newDoc),
      docName: () => auditConfig.docName(newDoc),
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => getSectionTitle(newValue),
      oldValue: () => getSectionTitle(oldValue),
    };
  },
  receivers: getReceivers,
};
