import { StandardsBookSections } from '/imports/share/collections/standards-book-sections';
import { ChangesKinds } from '../../../utils/changes-kinds';
import { getReceivers } from '../helpers';


export default {
  field: 'sectionId',
  logs: [
    {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Book section set to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Book section changed from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Book section removed',
      },
    },
  ],
  notifications: [
    {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set book section of {{{docDesc}}} {{{docName}}} to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed book section of {{{docDesc}}} {{{docName}}} from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed book section of {{{docDesc}}} {{{docName}}}',
      },
    },
  ],
  data({ diffs: { sectionId } }) {
    const { newValue, oldValue } = sectionId;

    const getSectionTitle = (_id) => {
      const { title } = StandardsBookSections.findOne({ _id }) || {};
      return title;
    };

    return {
      newValue: () => getSectionTitle(newValue),
      oldValue: () => getSectionTitle(oldValue),
    };
  },
  receivers({ newDoc, user }) {
    return getReceivers(newDoc, user);
  },
};
