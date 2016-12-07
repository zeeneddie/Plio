import { CollectionNames } from '/imports/share/constants';
import { addItem, changeItem, removeItem } from '/client/redux/actions/collectionsActions';

const collections = {
  [CollectionNames.HELP_DOCS]: 'helpDocs',
  [CollectionNames.FILES]: 'files',
  // ...add more here
};

export default setupObserver = (cursor, dispatch) => {
  const collection = collections[cursor.collection.name];
  let initializing = true;

  const handle = cursor.observe({
    added: (item) => {
      if (!initializing) {
        dispatch(addItem({
          collection,
          item,
        }));
      }
    },

    changed: (item) => {
      dispatch(changeItem({
        collection,
        item,
      }));
    },

    removed: (item) => {
      dispatch(removeItem({
        collection,
        item,
      }));
    },
  });

  initializing = false;

  return handle;
};
