import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';


Template.Actions_ToBeCompletedBy.viewmodel({
  mixin: ['search', 'user', 'members'],
  toBeCompletedBy: '',
  placeholder: 'To be completed by',
  selectFirstIfNoSelected: false,
  completionComments: '',
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { selected:userId } = viewmodel.getData();

    this.toBeCompletedBy(userId);

    if (!this._id) return;

    this.onUpdate({ userId });
  },
  canBeCompleted() {
    return !!this.onComplete && (this.toBeCompletedBy() === Meteor.userId());
  },
  complete() {
    return (viewmodel) => {
      const { text:completionComments } = viewmodel.getData();
      
      this.onComplete && this.onComplete({ completionComments });
    };
  },
  getData() {
    return { toBeCompletedBy: this.toBeCompletedBy() };
  }
});
