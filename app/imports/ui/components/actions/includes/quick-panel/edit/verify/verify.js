import { Template } from 'meteor/templating'
;
import { ActionStatuses } from '/imports/api/constants.js';
import { verify } from '/imports/api/actions/methods.js';

Template.Actions_QAPanel_Edit_Verify.viewmodel({
  comments: '',
  update(value) {
    this.parent().update(verify, { ...this.getData(value) });
  },
  getData(value) {
    const status = parseInt(_.invert(ActionStatuses)[`Completed - ${value}`], 10);
    const { comments:verificationResult } = this.data();
    return { status, verificationResult, isVerified: true };
  }
});
