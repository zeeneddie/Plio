import { ChangesKinds } from '../../../../utils/changes-kinds';
import { getCollectionByDocType } from '../../../../../share/helpers';

const getMatchedTitle = (value) => {
  if (value) {
    const { documentId, documentType } = value;
    const collection = getCollectionByDocType(documentType);

    if (collection) {
      const doc = collection.findOne({ _id: documentId });
      if (doc) {
        return doc.title;
      }
    }
  }

  return 'None';
};

export default {
  logs: {
    default: {
      message: {
        [ChangesKinds.FIELD_ADDED]:
          'Matched to set to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          'Matched to changed from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          'Matched to removed',
      },
    },
  },
  notifications: {
    default: {
      text: {
        [ChangesKinds.FIELD_ADDED]:
          '{{{userName}}} set matched to of {{{docDesc}}} {{{docName}}} to "{{{newValue}}}"',
        [ChangesKinds.FIELD_CHANGED]:
          '{{{userName}}} changed matched to of {{{docDesc}}} {{{docName}}} ' +
          'from "{{{oldValue}}}" to "{{{newValue}}}"',
        [ChangesKinds.FIELD_REMOVED]:
          '{{{userName}}} removed matched to of {{{docDesc}}} {{{docName}}}',
      },
    },
  },
  data({ diffs: { matchedTo: { newValue, oldValue } } }) {
    return {
      newValue: () => getMatchedTitle(newValue),
      oldValue: () => getMatchedTitle(oldValue),
    };
  },
};
