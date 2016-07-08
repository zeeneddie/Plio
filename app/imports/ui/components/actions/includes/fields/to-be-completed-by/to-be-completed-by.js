import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';


Template.Actions_ToBeCompletedBy.viewmodel({
  mixin: ['search', 'user', 'members'],
  toBeCompletedBy: '',
  placeholder: 'To be completed by',
  selectFirstIfNoSelected: false,
  canCompleteFormBeShown: false,
  completionComments: '',
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { selected } = viewmodel.getData();

    this.toBeCompletedBy(selected);

    this.parent().update && this.parent().update({ toBeCompletedBy: selected });
  },
  canBeCompleted() {
    return _.every([
      !!this.onComplete,
      this.toBeCompletedBy() === Meteor.userId(),
    ]);
  },
  isCompleteButtonVisible() {
    return this.canBeCompleted();
  },
  isCompleteFormVisible() {
    return this.canBeCompleted() && this.canCompleteFormBeShown();
  },
  showCompleteForm() {
    this.canCompleteFormBeShown(true);
  },
  hideCompleteForm() {
    this.canCompleteFormBeShown(false);
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
