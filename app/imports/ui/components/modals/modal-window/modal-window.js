import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { _ } from 'meteor/underscore';
import { ViewModel } from 'meteor/manuel:viewmodel';


Template.ModalWindow.viewmodel({
  mixin: 'collapse',
  isInitialized: false,
  onCreated() {
    // variables that don't need to be reactive
    this.savingStateTimeout = 500;
    this.timeout = null;
    this.errors = [];
  },
  onRendered(template) {
    this.modal.modal('show');
    this.modal.on('hidden.bs.modal', () => Blaze.remove(template.view));

    const oldOnpopstate = window.onpopstate;
    window.onpopstate = (e) => {
      this.close();
      if (_.isFunction(oldOnpopstate)) {
        oldOnpopstate(e);
      }
      window.onpopstate = oldOnpopstate;
    };
  },
  variation: '',
  isSaving: false,
  isWaiting: false,
  // uploadsCount: 0,
  error: '',
  submitCaption: 'Save',
  submitCaptionOnSave: 'Saving...',
  closeCaption: 'Close',
  closeCaptionOnSave: 'Saving...',
  cancelCaption: 'Cancel',
  // closeCaptionOnUpload: 'Uploading...',
  closeAfterCall: false,

  submitCaptionText() {
    return this.isSaving() && this.submitCaptionOnSave()
      ? this.submitCaptionOnSave()
      : this.submitCaption();
  },

  closeCaptionText() {
    if (this.isSaving() && this.variation() !== 'save') {
      return this.closeCaptionOnSave();
    }

    return this.closeCaption();
  },

  isVariation(variation) {
    return this.variation() === variation;
  },

  callMethod(method, args, cb) {
    if (_.isFunction(args)) {
      /* eslint-disable no-param-reassign */
      cb = args;
      args = {};
      /* eslint-disable no-param-reassign */
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

      if (err) {
        console.log(err);
        this.errors.push(err);
        this.closeAfterCall(false);
      }

      if (this.timeout) {
        Meteor.clearTimeout(this.timeout);
      }

      this.timeout = Meteor.setTimeout(() => {
        this.isSaving(false);

        const { errors } = this;
        let error;
        if (errors.length === 1 && !errors[0].isFromSubcard) {
          error = errors[0].reason || 'Internal server error';
        }

        if (error) {
          this.setError(error);
        } else if (this.closeAfterCall()) {
          this.close();
        }

        this.errors = [];
      }, this.savingStateTimeout);
    };
  },

  setError(errMessage) {
    this.error(errMessage);
    this.errorSection.collapse('show');
    this.modal.animate({ scrollTop: 0 }, 250, 'swing');
  },

  clearError() {
    this.error('');
    this.errorSection.collapse('hide');
  },

  close() {
    this.modal.modal('hide');
  },

  closeModal() {
    const subcardsToSave = ViewModel.find((vm) => {
      const _id = vm._id && vm._id();
      const isSubcard = vm.isSubcard && vm.isSubcard();
      return !_id && isSubcard;
    });

    if (this.isWaiting.value || this.isSaving.value || subcardsToSave.length) {
      this.closeAfterCall(true);

      _.each(subcardsToSave, (subcard) => {
        subcard.save();
      });
    } else {
      this.close();
    }
  },

  isCloseButtonDisabled() {
    return this.isSaving();
  },

  showCloseButtonSpinner() {
    return this.isSaving() && !this.isVariation('save');
  },
});
