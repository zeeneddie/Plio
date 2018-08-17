import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import invoke from 'lodash.invoke';

import { canBeVerified } from '../../../../../../api/actions/checkers';

Template.Actions_ToBeVerifiedBy.viewmodel({
  toBeVerifiedBy: '',
  placeholder: 'To be verified by',
  selectFirstIfNoSelected: false,
  isCompleted: true,
  isVerified: false,
  organizationId: '',
  selectArgs() {
    const {
      toBeVerifiedBy: value = '',
      placeholder,
      selectFirstIfNoSelected,
    } = this.data();

    return {
      value,
      placeholder,
      selectFirstIfNoSelected,
      onUpdate: (viewmodel) => {
        const { selected: userId } = viewmodel.getData();

        this.toBeVerifiedBy(userId);

        return invoke(this, 'onUpdate', { userId });
      },
    };
  },
  canBeVerified() {
    const organizationId = this.organizationId();
    const toBeVerifiedBy = this.toBeVerifiedBy();
    const isCompleted = this.isCompleted();
    const isVerified = this.isVerified();
    const action = {
      organizationId,
      isCompleted,
      isVerified,
      toBeVerifiedBy,
    };
    const userId = Meteor.userId();
    return !!this.onVerify && canBeVerified(action, userId);
  },
  verify() {
    return (viewmodel) => {
      const { text: verificationComments } = viewmodel.getData();

      this.onVerify && this.onVerify({
        verificationComments,
        success: true,
      });
    };
  },
  failVerification() {
    return (viewmodel) => {
      const { text: verificationComments } = viewmodel.getData();

      this.onVerify && this.onVerify({
        verificationComments,
        success: false,
      });
    };
  },
  getData() {
    return { toBeVerifiedBy: this.toBeVerifiedBy() };
  },
});
