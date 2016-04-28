import { Template } from 'meteor/templating';

import { handleMethodResult } from '/imports/api/helpers.js';

/**
 * Can be shown using ModalManager
 */
Template.ModalWindow.viewmodel({
  mixin: 'collapse',
  savingStateTimeout: 500,
  isSaving: false,
  error: '',
  moreInfoLink: '#',
  submitCaption: 'Save',
  guideHtml: 'No help message yet',

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
          this.setError(err.reason);
        } else {
          ModalManager.getInstanceByElement(this.modalHeading()).close();
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
