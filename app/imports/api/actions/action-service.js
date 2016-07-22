import { Actions } from './actions.js';
import { ActionTypes, ProblemTypes } from '../constants.js';
import { NonConformities } from '../non-conformities/non-conformities.js';
import { Risks } from '../risks/risks.js';
import Utils from '/imports/core/utils.js';


export default {
  collection: Actions,

  insert({ organizationId, type, ...args }) {
    const serialNumber = Utils.generateSerialNumber(this.collection, { organizationId, type });

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

  linkDocument({ _id, documentId, documentType }) {
    const action = this._getAction(_id);

    let docCollection;
    if (documentType === ProblemTypes.NC) {
      if (action.type === ActionTypes.RISK_CONTROL) {
        throw new Meteor.Error(
          400, 'Risk control cannot be linked to a non-conformity'
        );
      }

      docCollection = NonConformities;
    } else if (documentType === ProblemTypes.RISK) {
      if (action.type === ActionTypes.PREVENTATIVE_ACTION) {
        throw new Meteor.Error(
          400, 'Preventative action cannot be linked to a risk'
        );
      }

      docCollection = Risks;
    }

    if (!docCollection) {
      throw new Meteor.Error(400, 'Invalid document type');
    }

    const doc = docCollection.findOne({ _id: documentId });
    if (!doc) {
      throw new Meteor.Error(400, 'Document does not exist');
    }

    if (action.isLinkedToDocument(documentId, documentType)) {
      throw new Meteor.Error(
        400, 'This action is already linked to specified document'
      );
    }

    return this.collection.update({
      _id
    }, {
      $addToSet: {
        linkedTo: { documentId, documentType }
      }
    });
  },

  unlinkDocument({ _id, documentId, documentType }) {
    const action = this._getAction(_id);

    if (!action.isLinkedToDocument(documentId, documentType)) {
      throw new Meteor.Error(
        400, 'This action is not linked to specified document'
      );
    }

    return this.collection.update({
      _id
    }, {
      $pull: { linkedTo: { documentId, documentType } }
    });
  },

  complete({ _id, userId, completionComments }) {
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
        status: 3,
        completionComments
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
        completedAt: '',
        completionComments: ''
      }
    });
  },

  verify({ _id, userId, success, verificationComments }) {
    const action = this._getAction(_id);

    if (userId !== action.toBeVerifiedBy) {
      throw new Meteor.Error(400, 'You cannot verify this action');
    }

    if (!action.canBeVerified()) {
      throw new Meteor.Error(400, 'This action cannot be verified');
    }

    const status = (success === true) ? 7 : 6;

    return this.collection.update({
      _id
    }, {
      $set: {
        isVerified: true,
        verifiedBy: userId,
        verifiedAt: new Date,
        status,
        verificationComments
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
        verifiedAt: '',
        verificationComments: ''
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

  remove({ _id, deletedBy }) {
    const action = this._getAction(_id);
    const { isDeleted } = action;
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

      // XXX - We need to change the status as well

      return this.collection.update(query, options);
    }
  },

  restore({ _id }) {
    this._ensureActionIsDeleted(_id);

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

    // XXX - We need to change the status as well

    return this.collection.update(query, options);
  },

  _ensureActionIsDeleted(_id) {
    const action = this._getAction(_id);
    if (!action.isDeleted) {
      throw new Meteor.Error(400, 'Action needs to be deleted first');
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
  }
};
