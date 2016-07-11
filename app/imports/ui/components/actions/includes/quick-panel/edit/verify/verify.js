import { Template } from 'meteor/templating';
import { verify } from '/imports/api/actions/methods.js';

Template.Actions_QAPanel_Edit_Verify.viewmodel({
  comments: '',
  update(success) {
    this.parent().update(verify, { success, ...this.getData() });
  },
  getData(value) {
    const { comments:verificationComments } = this.data();
    return { verificationComments };
  }
});
