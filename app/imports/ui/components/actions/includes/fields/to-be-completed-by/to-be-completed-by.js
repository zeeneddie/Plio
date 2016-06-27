import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';


Template.Actions_ToBeCompletedBy.viewmodel({
  mixin: ['search', 'user', 'members'],
  toBeCompletedBy: '',
  placeholder: 'To be completed by',
  selectFirstIfNoSelected: false,
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { selected } = viewmodel.getData();

    this.toBeCompletedBy(selected);

    return this.parent().update({ toBeCompletedBy: selected });
  },
  showCompleteButton() {
    return this.onComplete && (this.toBeCompletedBy() === Meteor.userId());
  },
  getData() {
    return { toBeCompletedBy: this.toBeCompletedBy() };
  }
});
