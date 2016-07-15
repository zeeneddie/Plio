import { Template } from 'meteor/templating';

import { complete } from '/imports/api/actions/methods.js';

Template.Actions_QAPanel_Edit_Complete.viewmodel({
  comments: '',
  isAction: false,
  update() {
    if (this.isAction()) {
      this.parent().update(complete, { ...this.getData() });
    } else {
      // TODO method for root cause analysis
    }
  },
  getData() {
    const { comments:completionComments } = this.data();
    return { completionComments };
  }
});
