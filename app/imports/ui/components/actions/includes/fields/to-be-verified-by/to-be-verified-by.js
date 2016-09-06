import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import invoke from 'lodash.invoke';


Template.Actions_ToBeVerifiedBy.viewmodel({
  toBeVerifiedBy: '',
  placeholder: 'To be verified by',
  selectFirstIfNoSelected: false,
  selectArgs() {
    const {
      toBeVerifiedBy:value,
      placeholder,
      selectFirstIfNoSelected
    } = this.data();

    return {
      value,
      placeholder,
      selectFirstIfNoSelected,
      onUpdate: (viewmodel) => {
        const { selected:userId } = viewmodel.getData();

        this.toBeVerifiedBy(userId);

        return invoke(this, 'onUpdate', { userId });
      }
    };
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
