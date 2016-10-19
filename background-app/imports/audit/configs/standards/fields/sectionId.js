import { StandardsBookSections } from '/imports/share/collections/standards-book-sections.js';
import { ChangesKinds } from '../../../utils/changes-kinds.js';
import { getUserFullNameOrEmail } from '../../../utils/helpers.js';
import { getReceivers } from '../helpers.js';


export default {
  field: 'sectionId',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Book section set to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Book section changed from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Book section removed'
      }
    }
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{userName}} set book section of {{{docDesc}}} to "{{newValue}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{userName}} changed book section of {{{docDesc}}} from "{{oldValue}}" to "{{newValue}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{userName}} removed book section of {{{docDesc}}}'
      }
    }
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
      userName: () => getUserFullNameOrEmail(user),
      newValue: () => getSectionTitle(newValue),
      oldValue: () => getSectionTitle(oldValue)
    };
  },
  receivers: getReceivers
};
