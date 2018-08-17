import { Template } from 'meteor/templating';

import { ActionPlanOptions } from '/imports/share/constants.js';
import {
  insert,
  update,
  remove,
  complete,
  verify,
  undoCompletion,
  undoVerification,
} from '/imports/api/actions/methods';


Template.Actions_EditSubcard.viewmodel({
  isLinkedToEditable: true,
  update({ ...args }) {
    this.parent().update({ ...args });
  },
  getCompleteFn() {
    return ({ completionComments }) => {
      this.parent().callUpdate(this.completeFn, {
        _id: this._id(),
        completionComments,
      });
    };
  },
  getUndoCompletionFn() {
    return () => {
      this.parent().callUpdate(this.undoCompletionFn, {
        _id: this._id(),
      });
    };
  },
  getVerifyFn() {
    return ({ success, verificationComments }) => {
      this.parent().callUpdate(this.verifyFn, {
        _id: this._id(),
        success,
        verificationComments,
      });
    };
  },
  getUndoVerificationFn() {
    return () => {
      this.parent().callUpdate(this.undoVerificationFn, {
        _id: this._id(),
      });
    };
  },
  getLinkStandardFn() {
    return ({ standardId }, cb) => {
      this.parent().callUpdate(this.linkStandardFn, {
        _id: this._id(),
        standardId,
      }, cb);
    };
  },
  getUnlinkStandardFn() {
    return ({ standardId }, cb) => {
      this.parent().callUpdate(this.unlinkStandardFn, {
        _id: this._id(),
        standardId,
      }, cb);
    };
  },
  getLinkDocumentFn() {
    return ({ documentId, documentType }, cb) => {
      this.parent().callUpdate(this.linkDocumentFn, {
        _id: this._id(),
        documentId,
        documentType,
      }, cb);
    };
  },
  getUnlinkDocumentFn() {
    return ({ documentId, documentType }, cb) => {
      this.parent().callUpdate(this.unlinkDocumentFn, {
        _id: this._id(),
        documentId,
        documentType,
      }, cb);
    };
  },
  getUpdateCompletionDateFn() {
    return ({ targetDate }, cb) => {
      this.parent().callUpdate(this.updateCompletionDateFn, {
        _id: this._id(),
        targetDate,
      }, cb);
    };
  },
  getUpdateCompletionExecutorFn() {
    return ({ userId }, cb) => {
      this.parent().callUpdate(this.updateCompletionExecutorFn, {
        _id: this._id(),
        userId,
      }, cb);
    };
  },
  getUpdateVerificationDateFn() {
    return ({ targetDate }, cb) => {
      this.parent().callUpdate(this.updateVerificationDateFn, {
        _id: this._id(),
        targetDate,
      }, cb);
    };
  },
  getUpdateVerificationExecutorFn() {
    return ({ userId }, cb) => {
      this.parent().callUpdate(this.updateVerificationExecutorFn, {
        _id: this._id(),
        userId,
      }, cb);
    };
  },
  getData() {
    return this.child('Actions_Card_Edit_Main').getData();
  },
});
