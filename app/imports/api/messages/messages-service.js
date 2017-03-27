import { Messages } from '/imports/share/collections/messages';

export default {
  collection: Messages,

  insert({ ...args }) {
    return this.collection.insert({ ...args });
  },
  remove({ _id }) {
    return this.collection.remove({ _id });
  },
};
