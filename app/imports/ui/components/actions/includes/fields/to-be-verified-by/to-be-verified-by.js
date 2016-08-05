import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';


Template.Actions_ToBeVerifiedBy.viewmodel({
  mixin: ['search', 'user', 'members'],
  toBeVerifiedBy: '',
  placeholder: 'To be verified by',
  selectFirstIfNoSelected: false,
  canVerificationFormBeShown: false,
  verificationComments: '',
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
  isVerifyButtonVisible() {
    return this.canBeVerified();
  },
  isVerificationFormVisible() {
    return this.canBeVerified() && this.canVerificationFormBeShown();
  },
  showVerificationForm() {
    this.canVerificationFormBeShown(true);
  },
  hideVerificationForm() {
    this.canVerificationFormBeShown(false);
  },
  verify() {
    this.onVerify && this.onVerify({
      success: true,
      verificationComments: this.verificationComments()
    });
  },
  failVerification() {
    this.onVerify && this.onVerify({
      success: false,
      verificationComments: this.verificationComments()
    });
  },
  getData() {
    return { toBeVerifiedBy: this.toBeVerifiedBy() };
  }
});
