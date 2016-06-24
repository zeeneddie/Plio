import { Actions } from './actions.js';
import { ActionTypes } from '../constants.js';


export default {
  collection: Actions,

  insert({ organizationId, type, ...args }) {
    const lastAction = this.collection.findOne({
      organizationId,
      type,
      serialNumber: {
        $type: 16 // 32-bit integer
      }
    }, {
      sort: {
        serialNumber: -1
      }
    });

    const serialNumber = lastAction ? lastAction.serialNumber + 1 : 1;

    const sequentialId = `${type}${serialNumber}`;

    return this.collection.insert({
      organizationId, type, serialNumber, sequentialId, ...args
    });
  },

  update({ _id, query = {}, options = {}, ...args }) {
    this._ensureActionExists(_id);

    if (!_.keys(query).length > 0) {
      query = { _id };
    }
    if (!_.keys(options).length > 0) {
      options['$set'] = args;
    }

    return this.collection.update(query, options);
  },

  updateViewedBy({ _id, userId }) {
    this._ensureActionExists(_id);

    if (!!this.collection.findOne({ _id, viewedBy: userId })) {
      throw new Meteor.Error(
        400, 'You have been already added to this list'
      );
    }

    return this.collection.update({ _id }, {
      $addToSet: {
        viewedBy: userId
      }
    });
  },

  remove({ _id, deletedBy, isDeleted }) {
    this._ensureActionExists(_id);

    const query = { _id };

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

      return this.collection.update(query, options);
    }
  },

  _ensureActionExists(_id) {
    if (!this.collection.findOne({ _id })) {
      throw new Meteor.Error(400, 'Action does not exist');
    }
  }
};
