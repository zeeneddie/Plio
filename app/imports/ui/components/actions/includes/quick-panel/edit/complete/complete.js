import { Template } from 'meteor/templating';

import { ActionStatuses } from '/imports/api/constants.js';
import { complete } from '/imports/api/actions/methods.js';

Template.Actions_QAPanel_Edit_Complete.viewmodel({
  comments: '',
  update() {
    this.parent().update(complete, { ...this.getData() });
  },
  getData() {
    const status = parseInt(_.invert(ActionStatuses)['In progress - completed, not yet verified'], 10);
    const { comments:completionResult } = this.data();
    return { status, completionResult };
  }
});
