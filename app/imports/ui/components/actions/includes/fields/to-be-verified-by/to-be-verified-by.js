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

    this.onUpdate({ userId: selected });
  },
  canBeVerified() {
    return !!this.onVerify && (this.toBeVerifiedBy() === Meteor.userId());
  },
  verify() {
    return (viewmodel) => {
      const { text:verificationComments } = viewmodel.getData();

      this.onVerify && this.onVerify({
        verificationComments,
        success: true
      });
    };
  },
  failVerification() {
    return (viewmodel) => {
      const { text:verificationComments } = viewmodel.getData();

      this.onVerify && this.onVerify({
        verificationComments,
        success: false
      });
    };
  },
  getData() {
    return { toBeVerifiedBy: this.toBeVerifiedBy() };
  }
});
