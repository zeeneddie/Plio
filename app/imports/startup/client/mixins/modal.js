import { ViewModel } from 'meteor/manuel:viewmodel';
import { Blaze } from 'meteor/blaze';
import { Template } from 'meteor/templating';

export default {
  modal: {
    instance() {
      return ViewModel.findOne('ModalWindow');
    },
    open(data) {
      if(this.instance() !== undefined) return;

      Blaze.renderWithData(Template.ModalWindow, data, document.body);
    },
    close() {
      this.instance() && this.instance().modal.modal('hide');
    },
    isSaving(val) {
      const instance = this.instance();

      if (val !== undefined) {
        instance && instance.isSaving(val);
      }

      return instance && instance.isSaving();
    },
    isWaiting(val) {
      const instance = this.instance();

      if (val !== undefined) {
        instance.isWaiting(val);
      }

      return instance.isWaiting();
    },
    setError(err) {
      return this.instance() && this.instance().setError(err);
    },
    clearError() {
      return this.instance() && this.instance().clearError();
    },
    callMethod(method, args, cb) {
      return this.instance() && this.instance().callMethod(method, args, cb);
    },
    handleMethodResult(cb) {
      return this.instance() && this.instance().handleMethodResult(cb);
    }
  }
};
