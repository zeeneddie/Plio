import { ViewModel } from 'meteor/manuel:viewmodel';
import { Blaze } from 'meteor/blaze';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';

export default {
  modal: {
    instance() {
      return ViewModel.findOne('ModalWindow');
    },
    open(data) {
      if (ViewModel.findOne('ModalWindow')) return;

      Blaze.renderWithData(Template.ModalWindow, data, document.body);
    },
    close(cb) {
      const modalInst = this.instance() && this.instance().modal;
      if (!modalInst) {
        return;
      }

      if (_.isFunction(cb)) {
        modalInst.one('hidden.bs.modal', cb);
      }

      modalInst.modal('hide');
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
    },
  },
};
