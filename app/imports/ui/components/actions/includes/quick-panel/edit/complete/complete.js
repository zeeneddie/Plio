import { Template } from 'meteor/templating';

import { complete } from '/imports/api/actions/methods.js';

Template.Actions_QAPanel_Edit_Complete.viewmodel({
  comments: '',
  update() {
    this.parent().update(complete, { ...this.getData() });
  },
  getData() {
    const { comments:completionComments } = this.data();
    return { completionComments };
  }
});
