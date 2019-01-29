import { Template } from 'meteor/templating';

import { StringLimits } from '../../../../../../share/constants';

Template.Actions_CompletionComments.viewmodel({
  mixin: 'callWithFocusCheck',
  completionComments: '',
  maxLength: StringLimits.comments.max,
  enabled: true,
  update(e) {
    const { completionComments } = this.getData();
    if (completionComments === this.templateInstance.data.completionComments) {
      return;
    }

    const { update } = this.parent();
    if (update) {
      update({ e, completionComments, withFocusCheck: true });
    }
  },
  getData() {
    return { completionComments: this.completionComments() };
  },
});
