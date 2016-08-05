import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';


Template.Actions_ToBeCompletedBy.viewmodel({
  mixin: ['search', 'user', 'members'],
  toBeCompletedBy: '',
  placeholder: 'To be completed by',
  selectFirstIfNoSelected: false,
  canCompletionFormBeShown: false,
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
  isCompleteButtonVisible() {
    return this.canBeCompleted();
  },
  isCompletionFormVisible() {
    return this.canBeCompleted() && this.canCompletionFormBeShown();
  },
  showCompletionForm() {
    this.canCompletionFormBeShown(true);
  },
  hideCompletionForm() {
    this.canCompletionFormBeShown(false);
  },
  complete() {
    this.onComplete && this.onComplete({
      completionComments: this.completionComments()
    });
  },
  getData() {
    return { toBeCompletedBy: this.toBeCompletedBy() };
  }
});
