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
  error: '',
  moreInfoLink: '#',
  submitCaption: 'Save',
  guideHtml: 'No help message yet',

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
          // console.log('Modal submit error:\n', err);
          console.log(err.details)
          this.setError(err.reason || 'Internal server error');
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
  }
});
