import { Template } from 'meteor/templating';

import { complete, verify } from '/imports/api/actions/methods';
import {
  completeAnalysis as NCCompleteAnalysis,
  updateStandards as NCCompleteStandards,
} from '/imports/api/non-conformities/methods';
import {
  completeAnalysis as RKCompleteAnalysis,
  updateStandards as RKCompleteStandards,
} from '/imports/api/risks/methods';
import { WorkItemsStore } from '/imports/share/constants';

const { TYPES, LINKED_TYPES } = WorkItemsStore;

Template.WorkInbox_QAPanel_Edit_Complete.viewmodel({
  onCreated() {
    this.load(this.doc());
  },
  doc: '',
  comments: '',
  update(success) {
    const { type, linkedDoc: { type: docType } } = this.data();
    const method = this._getMethodByType({ type, docType });
    const args = {
      ...this.getData(),
      ...(() => this.isType('VERIFY_ACTION') ? { success } : {})(),
    };

    this.parent().update(method, args);
  },
  isType(type) {
    return this.type() === TYPES[type];
  },
  _getMethodByType({ type, docType }) {
    const byDocType = ([NCMethod, riskMethod]) => {
      switch (docType) {
        case LINKED_TYPES.NON_CONFORMITY:
        case LINKED_TYPES.POTENTIAL_GAIN:
          return NCMethod;
        case LINKED_TYPES.RISK:
          return riskMethod;
        default:
          return null;
      }
    };

    switch (type) {
      case TYPES.COMPLETE_ACTION:
        return complete;
      case TYPES.VERIFY_ACTION:
        return verify;
      case TYPES.COMPLETE_ANALYSIS:
        return byDocType([NCCompleteAnalysis, RKCompleteAnalysis]);
      case TYPES.COMPLETE_UPDATE_OF_DOCUMENTS:
        return byDocType([NCCompleteStandards, RKCompleteStandards]);
      default:
        return null;
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
  },
});
