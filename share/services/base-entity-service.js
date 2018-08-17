import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

import { SystemName } from '../constants';

export default class BaseEntityService {
  constructor(collection) {
    this.collection = collection;
  }

  insert(args) {
    return this.collection.insert(args);
  }

  update({
    _id, query = {}, options = {}, ...args
  }) {
    if (!Object.keys(query).length) {
      Object.assign(query, { _id });
    }

    if (!Object.keys(options).length) {
      Object.assign(options, { $set: args });
    }

    return this.collection.update(query, options);
  }

  updateViewedBy({ _id, viewedBy }) {
    const query = { _id };
    const options = { $addToSet: { viewedBy } };

    return this.collection.update(query, options);
  }

  remove({
    _id, deletedBy, onSoftDelete, onPermanentDelete,
  }) {
    const query = { _id };

    const prevDoc = this.collection.findOne({ _id });
    const { isDeleted } = prevDoc;

    if (isDeleted) {
      const result = this.collection.remove(query);

      if (Meteor.isServer && _(onPermanentDelete).isFunction()) {
        Meteor.defer(() => onPermanentDelete(prevDoc));
      }

      return result;
    }
    const modifier = {
      $set: {
        deletedBy,
        isDeleted: true,
        deletedAt: new Date(),
      },
    };

    const ret = this.collection.update(query, modifier);

    if (Meteor.isServer && _(onSoftDelete).isFunction()) {
      Meteor.defer(() => onSoftDelete(prevDoc));
    }

    return ret;
  }

  restore({ _id, query = {}, onRestore }) {
    if (_(query).isEmpty()) {
      Object.assign(query, { _id });
    }

    const options = {
      $set: {
        isDeleted: false,
      },
      $unset: {
        deletedBy: '',
        deletedAt: '',
      },
    };

    const ret = this.collection.update(query, options, { multi: true });

    if (Meteor.isServer && _(onRestore).isFunction()) {
      Meteor.defer(onRestore);
    }

    return ret;
  }

  removePermanently({ _id, query = {} }) {
    if (_(query).isEmpty()) {
      Object.assign(query, { _id });
    }

    return this.collection.remove(query);
  }

  removeSoftly({ _id, deletedBy, query = {} }) {
    if (_(query).isEmpty()) {
      Object.assign(query, { _id });
    }

    const options = {
      $set: {
        isDeleted: true,
        deletedBy: deletedBy || SystemName,
        deletedAt: new Date(),
      },
    };

    return this.collection.update(query, options, { multi: true });
  }
}
