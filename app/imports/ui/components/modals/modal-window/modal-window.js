import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

import { handleMethodResult } from '/imports/api/helpers.js';

Template.ModalWindow.viewmodel({
  mixin: 'collapse',
  onRendered(template) {
    this.modal.modal('show');
    this.modal.on('hidden.bs.modal', e => Blaze.remove(template.view));
  },
  variation: '',
  savingStateTimeout: 500,
  isSaving: false,
  isWaiting: false,
  error: '',
  moreInfoLink: '#',
  submitCaption: 'Save',
  submitCaptionOnSave: 'Saving...',
  closeCaption: 'Close',
  closeCaptionOnSave: 'Saving...',
  guideHtml: 'No help message yet',
  closeAfterCall: false,

  submitCaptionText() {
    return this.isSaving() && this.submitCaptionOnSave() ? this.submitCaptionOnSave() : this.submitCaption();
  },

  closeCaptionText() {
    return this.isSaving() && !this.variation() ? this.closeCaptionOnSave() : this.closeCaption();
  },

  isVariation(variation) {
    return this.variation() === variation;
  },

  callMethod(method, args, cb) {
    if (_.isFunction(args)) {
      cb = args;
      args = {};
    }

    this.clearError();
    this.isSaving(true);

    method.call(args, this.handleMethodResult(cb));
  },

  handleMethodResult(cb) {
    return (err, res) => {
      // if callback returns true, doesn't perform default actions
      if (_.isFunction(cb) && cb(err, res)) {
        return;
      }

      if (this.timeout) {
        Meteor.clearTimeout(this.timeout);
      }

      this.timeout = Meteor.setTimeout(() => {
        this.isSaving(false);

        if (err) {
          console.log('Modal submit error:\n', err);
          this.setError(err.reason || 'Internal server error');
        } else if (this.closeAfterCall()) {
          this.close();
        }
      }, this.savingStateTimeout());
    };
  },

  setError(errMessage) {
    this.error(errMessage);
    this.errorSection.collapse('show');
  },

  clearError() {
    this.error('');
    this.errorSection.collapse('hide');
  },

  close() {
    this.modal.modal('hide');
  },

  closeModal() {
    if (this.isWaiting.value || this.isSaving.value) {
      this.closeAfterCall(true);
    } else {
      this.close();
    }
  },

  showSpinner() {
    return this.isSaving() || this.isWaiting();
  }
});
