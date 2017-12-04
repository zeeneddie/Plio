import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import invoke from 'lodash.invoke';

Template.Actions_ToBeCompletedBy.viewmodel({
  mixin: ['search', 'user', 'members'],
  toBeCompletedBy: '',
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
    return !!this.onComplete && (this.toBeCompletedBy() === Meteor.userId());
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
