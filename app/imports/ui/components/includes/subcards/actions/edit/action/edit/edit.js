import { Template } from 'meteor/templating';

import { ActionPlanOptions } from '/imports/api/constants.js';
import {
  insert,
  update,
  remove,
  complete,
  verify,
  undoCompletion,
  undoVerification
} from '/imports/api/actions/methods.js';


Template.Actions_EditSubcard.viewmodel({
  update({ ...args }) {
    this.parent().update({ ...args });
  },
  getCompleteFn() {
    return ({ completionComments }) => {
      this.parent().callUpdate(this.completeFn, {
        _id: this._id(),
        completionComments
      });
    };
  },
  getUndoCompletionFn() {
    return () => {
      this.parent().callUpdate(this.undoCompletionFn, {
        _id: this._id()
      });
    };
  },
  getVerifyFn() {
    return ({ success, verificationComments }) => {
      this.parent().callUpdate(this.verifyFn, {
        _id: this._id(),
        success,
        verificationComments
      });
    };
  },
  getUndoVerificationFn() {
    return () => {
      this.parent().callUpdate(this.undoVerificationFn, {
        _id: this._id()
      });
    };
  },
  getLinkStandardFn() {
    return ({ standardId }, cb) => {
      this.parent().callUpdate(this.linkStandardFn, {
        _id: this._id(),
        standardId
      }, cb);
    };
  },
  getUnlinkStandardFn() {
    return ({ standardId }, cb) => {
      this.parent().callUpdate(this.unlinkStandardFn, {
        _id: this._id(),
        standardId
      }, cb);
    };
  },
  getLinkDocumentFn() {
    return ({ documentId, documentType }, cb) => {
      this.parent().callUpdate(this.linkDocumentFn, {
        _id: this._id(),
        documentId,
        documentType
      }, cb);
    };
  },
  getUnlinkDocumentFn() {
    return ({ documentId, documentType }, cb) => {
      this.parent().callUpdate(this.unlinkDocumentFn, {
        _id: this._id(),
        documentId,
        documentType
      }, cb);
    };
  },
  getData() {
    return this.child('Actions_Card_Edit_Main').getData();
  }
});
