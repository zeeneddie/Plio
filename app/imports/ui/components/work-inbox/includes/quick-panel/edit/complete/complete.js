import { Template } from 'meteor/templating';

import { complete, verify } from '/imports/api/actions/methods.js';
import { WorkItemsStore } from '/imports/api/constants.js';

const { TYPES } = WorkItemsStore;

Template.WorkInbox_QAPanel_Edit_Complete.viewmodel({
  onCreated() {
    this.load(this.doc());
  },
  doc: '',
  comments: '',
  update(success) {
    const { _id, type } = this.data();
    const method = this._getMethodByType({ type });
    const args = { ...this.getData(), ...(() => this.isType('VERIFY_ACTION') ? { success } : {})() };

    this.parent().update(method, args);
  },
  getPositiveButtonText(bool, { type }) {
    return type && type === TYPES.VERIFY_ACTION ? 'Verified as effective' : 'Complete';
  },
  isType(type) {
    return this.type() === TYPES[type];
  },
  _getMethodByType({ type }) {
    switch(type) {
      case TYPES.COMPLETE_ACTION:
        return complete;
        break;
      case TYPES.VERIFY_ACTION:
        return verify;
        break;
      case TYPES.COMPLETE_ANALYSIS:
        return ;
        break;
      case TYPES.COMPLETE_UPDATE_OF_STANDARDS:
        return ;
        break;
      default:
        return null;
        break;
    }
  },
  getData() {
    const { comments } = this.data();
    return { [this.isType('VERIFY_ACTION') ? 'verificationComments' : 'completionComments']: comments };
  }
});
