import { Actions } from './actions.js';
import { ActionTypes } from '../constants.js';
import { Standards } from '../standards/standards.js';
import { NonConformities } from '../non-conformities/non-conformities.js';
import { Risks } from '../risks/risks.js';


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

  linkStandard({ _id, standardId }) {
    if (!Standards.findOne({ _id: standardId })) {
      throw new Meteor.Error(400, 'Standard does not exist');
    }

    const action = this._getAction(_id);

    if (action.isLinkedToStandard(standardId)) {
      throw new Meteor.Error(
        400, 'Action is already linked to specified standard'
      );
    }

    return this.collection.update({
      _id
    }, {
      $addToSet: { linkedStandardsIds: standardId }
    });
  },

  unlinkStandard({ _id, standardId }) {
    const action = this._getAction(_id);

    if (!action.isLinkedToStandard(standardId)) {
      throw new Meteor.Error(
        400, 'Action is not linked to specified standard'
      );
    }

    return this.collection.update({
      _id
    }, {
      $pull: { linkedStandardsIds: standardId }
    });
  },

  linkProblem({ _id, problemId, problemType }) {
    let docCollection;
    if (problemType === 'non-conformity') {
      docCollection = NonConformities;
    } else if (problemType === 'risk') {
      docCollection = Risks;
    }

    if (!docCollection) {
      throw new Meteor.Error(400, 'Invalid problem type');
    }

    const doc = docCollection.findOne({ _id: problemId });

    if (!doc) {
      throw new Meteor.Error(400, 'Problem document does not exist');
    }

    const action = this._getAction(_id);

    if (action.isLinkedToProblem(problemId, problemType)) {
      throw new Meteor.Error(
        400, 'This action is already linked to specified problem document'
      );
    }

    this.collection.update({
      _id
    }, {
      $push: { linkedProblems: { problemId, problemType } }
    });
  },

  unlinkProblem({ _id, problemId, problemType }) {
    const action = this._getAction(_id);

    if (!action.isLinkedToProblem(problemId, problemType)) {
      throw new Meteor.Error(
        400, 'This action is not linked to specified problem document'
      );
    }

    return this.collection.update({
      _id
    }, {
      $pull: { linkedProblems: { problemId, problemType } }
    });
  },

  complete({ _id, userId }) {
    const action = this._getAction(_id);

    if (userId !== action.toBeCompletedBy) {
      throw new Meteor.Error(400, 'You cannot complete this action');
    }

    if (!action.canBeCompleted()) {
      throw new Meteor.Error(400, 'This action cannot be completed');
    }

    return this.collection.update({
      _id
    }, {
      $set: {
        isCompleted: true,
        completedBy: userId,
        completedAt: new Date(),
        status: 3
      }
    });
  },

  undoCompletion({ _id, userId }) {
    const action = this._getAction(_id);

    if (userId !== action.completedBy) {
      throw new Meteor.Error(400, 'You cannot undo completion of this action');
    }

    if (!action.canCompletionBeUndone()) {
      throw new Meteor.Error(400, 'Completion of this action cannot be undone');
    }

    return this.collection.update({
      _id
    }, {
      $set: {
        isCompleted: false,
        status: 0
      },
      $unset: {
        completedBy: '',
        completedAt: ''
      }
    });
  },

  verify({ _id, userId }) {
    const action = this._getAction(_id);

    if (userId !== action.toBeVerifiedBy) {
      throw new Meteor.Error(400, 'You cannot verify this action');
    }

    if (!action.canBeVerified()) {
      throw new Meteor.Error(400, 'This action cannot be verified');
    }

    return this.collection.update({
      _id
    }, {
      $set: {
        isVerified: true,
        verifiedBy: userId,
        verifiedAt: new Date,
        status: 7
      }
    });
  },

  undoVerification({ _id, userId }) {
    const action = this._getAction(_id);

    if (userId !== action.verifiedBy) {
      throw new Meteor.Error(400, 'You cannot undo verification of this action');
    }

    if (!action.canVerificationBeUndone()) {
      throw new Meteor.Error(400, 'Verification of this action cannot be undone');
    }

    return this.collection.update({
      _id
    }, {
      $set: {
        isVerified: false,
        status: 3
      },
      $unset: {
        verifiedBy: '',
        verifiedAt: ''
      }
    });
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
  },

  _getAction(_id) {
    const action = this.collection.findOne({ _id });
    if (!action) {
      throw new Meteor.Error(400, 'Action does not exist');
    }
    return action;
  },
};
