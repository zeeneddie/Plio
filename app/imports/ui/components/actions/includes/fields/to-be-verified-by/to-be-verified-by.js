import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';


Template.Actions_ToBeVerifiedBy.viewmodel({
  mixin: ['search', 'user', 'members'],
  toBeVerifiedBy: '',
  placeholder: 'To be verified by',
  selectFirstIfNoSelected: false,
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { selected } = viewmodel.getData();

    this.toBeVerifiedBy(selected);

    this.parent().update && this.parent().update({ toBeVerifiedBy: selected });
  },
  showVerifyButton() {
    return this.onVerify && (this.toBeVerifiedBy() === Meteor.userId());
  },
  getData() {
    return { toBeVerifiedBy: this.toBeVerifiedBy() };
  }
});
