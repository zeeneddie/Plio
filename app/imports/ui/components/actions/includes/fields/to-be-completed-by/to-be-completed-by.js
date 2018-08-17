import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import invoke from 'lodash.invoke';

import { canBeCompleted } from '../../../../../../api/actions/checkers';

Template.Actions_ToBeCompletedBy.viewmodel({
  mixin: ['search', 'user', 'members'],
  toBeCompletedBy: '',
  organizationId: null,
  placeholder: 'To be completed by',
  selectFirstIfNoSelected: false,
  completionComments: '',
  selectArgs() {
    const {
      toBeCompletedBy: value = '',
      placeholder,
      selectFirstIfNoSelected,
    } = this.data();

    return {
      value,
      placeholder,
      selectFirstIfNoSelected,
      onUpdate: (viewmodel) => {
        const { selected: userId } = viewmodel.getData();

        this.toBeCompletedBy(userId);

        if (!this._id) return;

        invoke(this, 'onUpdate', { userId });
      },
    };
  },
  canBeCompleted() {
    if (!this.onComplete) return false;
    const userId = Meteor.userId();
    const toBeCompletedBy = this.toBeCompletedBy();
    const organizationId = this.organizationId();
    return canBeCompleted({ toBeCompletedBy, organizationId }, userId);
  },
  complete() {
    return (viewmodel) => {
      const { text: completionComments } = viewmodel.getData();

      this.onComplete && this.onComplete({ completionComments });
    };
  },
  getData() {
    return { toBeCompletedBy: this.toBeCompletedBy() };
  },
});
