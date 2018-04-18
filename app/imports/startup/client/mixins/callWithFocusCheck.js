import { Meteor } from 'meteor/meteor';
import { ViewModel } from 'meteor/manuel:viewmodel';

export default {
  callWithFocusCheck(e, updateFn) {
    const modal = ViewModel.findOne('ModalWindow');

    if (!modal) {
      updateFn();
      return;
    }

    modal.isWaiting(true);

    Meteor.setTimeout(() => {
      modal.isWaiting(false);

      const tpl = this.templateInstance;

      if (tpl.view.isDestroyed) {
        return;
      }

      if (tpl.$(e.target).is(':focus')) {
        return;
      }

      updateFn();
    }, 200);
  },
};
