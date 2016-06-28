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
    this._getActionOrThrow(_id);

    if (!_.keys(query).length > 0) {
      query = { _id };
    }
    if (!_.keys(options).length > 0) {
      options['$set'] = args;
    }

    return this.collection.update(query, options);
  },

  complete({ _id, userId }) {
    const { isCompleted, toBeCompletedBy } = this._getActionOrThrow(_id);

    if (userId !== toBeCompletedBy) {
      throw new Meteor.Error(400, 'You cannot complete this action');
    }

    if (isCompleted === true) {
      throw new Meteor.Error(400, 'This action is already completed');
    }

    this.collection.update({
      _id
    }, {
      $set: {
        isCompleted: true,
        completedBy: userId,
        completedAt: new Date()
      }
    });
  },

  undoCompletion({ _id, userId }) {
    const { isCompleted, completedBy, isVerified } = this._getActionOrThrow(_id);

    if (userId !== completedBy) {
      throw new Meteor.Error(400, 'You cannot undo completion of this action');
    }

    if (isCompleted !== true) {
      throw new Meteor.Error(400, 'This action is not completed');
    }

    if (isVerified === true) {
      throw new Meteor.Error(400, 'This action is already verified');
    }

    this.collection.update({
      _id
    }, {
      $set: { isCompleted: false },
      $unset: {
        completedBy: '',
        completedAt: ''
      }
    });
  },

  verify({ _id, userId }) {
    const { isCompleted, isVerified, toBeVerifiedBy } = this._getActionOrThrow(_id);

    if (userId !== toBeVerifiedBy) {
      throw new Meteor.Error(400, 'You cannot verify this action');
    }

    if (isCompleted === false) {
      throw new Meteor.Error(400, 'This action is not completed');
    }

    if (isVerified === true) {
      throw new Meteor.Error(400, 'This action is already verified');
    }

    this.collection.update({
      _id
    }, {
      $set: {
        isVerified: true,
        verifiedBy: userId,
        verifiedAt: new Date
      }
    });
  },

  undoVerification({ _id, userId }) {
    const { isVerified, verifiedBy } = this._getActionOrThrow(_id);

    if (userId !== verifiedBy) {
      throw new Meteor.Error(400, 'You cannot undo verification of this action');
    }

    if (isVerified === false) {
      throw new Meteor.Error(400, 'This action is not verified');
    }

    this.collection.update({
      _id
    }, {
      $set: { isVerified: false },
      $unset: {
        verifiedBy: '',
        verifiedAt: ''
      }
    });
  },

  updateViewedBy({ _id, userId }) {
    this._getActionOrThrow(_id);

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
    this._getActionOrThrow(_id);

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

  _getActionOrThrow(_id) {
    const action = this.collection.findOne({ _id });
    if (!action) {
      throw new Meteor.Error(400, 'Action does not exist');
    }
    return action;
  }
};
