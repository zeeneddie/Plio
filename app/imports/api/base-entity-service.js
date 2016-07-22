export default class BaseEntityService {
  constructor(collection) {
    if (!collection) {
      throw new Error('collection is undefined');
    }

    this.collection = collection;
  }

  updateViewedBy({ _id, viewedBy }) {
    const query = { _id };
    const options = { $addToSet: { viewedBy } };

    return this.collection.update(query, options);
  }

  remove({ _id, deletedBy }) {
    const query = { _id };

    const { isDeleted } = this.collection.findOne({ _id });

    if (isDeleted) {
      return this.collection.remove(query);
    } else {
      const options = {
        $set: {
          isDeleted: true,
          deletedBy,
          deletedAt: new Date()
        }
      };

      // XXX - we need to change the status here as well

      return this.collection.update(query, options);
    }
  }

  restore({ _id }) {
    const { isDeleted } = this.collection.findOne({ _id });

    if (isDeleted) {
      throw new Error(400);
    } else {
      const query = { _id };
      const options = {
        $set: {
          isDeleted: false
        },
        $unset: {
          deletedBy: '',
          deletedAt: ''
        }
      };

      return this.collection.update(query, options);
    }
  }
}
