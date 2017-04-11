import { Template } from 'meteor/templating';

import { complete, verify } from '/imports/api/actions/methods';
import { completeAnalysis as NCCompleteAnalysis, updateStandards as NCCompleteStandards } from '/imports/api/non-conformities/methods';
import { completeAnalysis as RKCompleteAnalysis, updateStandards as RKCompleteStandards } from '/imports/api/risks/methods';
import { WorkItemsStore } from '/imports/share/constants.js';

const { TYPES, LINKED_TYPES } = WorkItemsStore;

Template.WorkInbox_QAPanel_Edit_Complete.viewmodel({
  onCreated() {
    this.load(this.doc());
  },
  doc: '',
  comments: '',
  update(success) {
    const { _id, type, linkedDoc: { type: docType } } = this.data();
    const method = this._getMethodByType({ type, docType });
    const args = {
      ...this.getData(),
      ...(() => this.isType('VERIFY_ACTION') ? { success } : {})()
    };

    this.parent().update(method, args);
  },
  isType(type) {
    return this.type() === TYPES[type];
  },
  _getMethodByType({ type, docType }) {
    const byDocType = ([NCMethod, riskMethod]) => {
      switch(docType) {
        case LINKED_TYPES.NON_CONFORMITY:
          return NCMethod;
          break;
        case LINKED_TYPES.RISK:
          return riskMethod;
          break;
        default:
          return null;
          break;
      }
    };

    switch(type) {
      case TYPES.COMPLETE_ACTION:
        return complete;
        break;
      case TYPES.VERIFY_ACTION:
        return verify;
        break;
      case TYPES.COMPLETE_ANALYSIS:
        return byDocType([NCCompleteAnalysis, RKCompleteAnalysis]);
        break;
      case TYPES.COMPLETE_UPDATE_OF_DOCUMENTS:
        return byDocType([NCCompleteStandards, RKCompleteStandards]);
        break;
      default:
        return null;
        break;
    }
  },
  getCommentsPlaceholder() {
    switch (this.type()) {
      case TYPES.VERIFY_ACTION:
        return 'Enter any verification comments';
      case TYPES.COMPLETE_UPDATE_OF_DOCUMENTS:
        return 'Enter any approval comments';
      default:
        return 'Enter any completion comments';
    }
  },
  getData() {
    const { comments } = this.data();
    const key = this.isType('VERIFY_ACTION') ? 'verificationComments' : 'completionComments';
    return { [key]: comments };
  }
});
