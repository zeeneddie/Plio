/* global $, _ */
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';
import { Tracker } from 'meteor/tracker';
import { ViewModel } from 'meteor/manuel:viewmodel';

import { isViewed } from '../../../../../api/checkers';

Template.Subcard.viewmodel({
  mixin: ['collapse', 'callWithFocusCheck'],
  doc: '',
  parentFirstNode: '',
  isSubcard: true,
  isSaving: false,
  isWaiting: false,
  closeAfterCall: false,
  error: '',
  _rText: '',
  content: '',
  autorun() {
    this.load(this.doc());
  },
  onRendered() {
    if (!this._id) {
      this.toggleCollapse(null, 250);
    }
  },
  isNew() {
    return !isViewed(this.doc(), Meteor.userId());
  },
  handleToggleCollapse() {
    this.clearError('');
    if (this._id) {
      this.toggleCollapse(null, 250);
    }
  },
  callInsert(insertFn, args, cb) {
    const $parentFirstNode = $(this.templateInstance.firstNode).closest('.card-block-collapse');

    this.beforeSave();

    const afterInsert = (err, res) => {
      this.afterSave(err, res, cb);

      if (!err) {
        this.destroy();

        Tracker.afterFlush(() => {
          const newSubcard = ViewModel.findOne('Subcard', vm => vm._id && vm._id() === res);

          if (newSubcard) {
            newSubcard.subcard.closest('.modal').animate({
              scrollTop: newSubcard.subcard.position().top + 70,
            }, 500, 'swing');
          } else if ($parentFirstNode.length) {
            $parentFirstNode.closest('.modal').scrollTop($parentFirstNode.position().top + 20);
          }
        });
      }
    };

    // We need this setTimeout to display a Saving... state
    Meteor.setTimeout(() => {
      this.subcard.addClass('hidden');
      insertFn(args, afterInsert);
    }, 500);
  },
  callUpdate(updateFn, args, cb) {
    this.beforeSave();

    updateFn(args, (err, res) => {
      this.afterSave(err, res, cb, 500);
    });
  },
  beforeSave() {
    this.isWaiting(false);
    this.isSaving(true);
    this.clearError();
  },
  afterSave(err, res, cb, timeout) {
    const afterSaveFn = () => {
      if (err) {
        // eslint-disable-next-line no-param-reassign
        err.isFromSubcard = true;
      }

      this.isSaving(false);

      if (err) {
        this.subcard.removeClass('hidden');
        this.setError(err.reason);

        const currentSubcard = this.subcard;
        currentSubcard.closest('.modal').animate({
          scrollTop: currentSubcard.position().top + 70,
        }, 500, 'swing');
      } else if (this.closeAfterCall()) {
        this.toggleCollapse();
      }

      this.closeAfterCall(false);

      if (_.isFunction(cb)) {
        return cb(err, res);
      }
      return null;
    };

    if (_.isFinite(timeout) && (timeout >= 0)) {
      Meteor.setTimeout(() => {
        afterSaveFn();
      }, timeout);
    } else {
      afterSaveFn();
    }
  },
  close() {
    const _id = this._id && this._id();

    if (_id) {
      if (this.isWaiting.value || this.isSaving.value) {
        this.closeAfterCall(true);
      } else {
        this.toggleCollapse();
      }
    } else if (this.save) {
      this.save();
    }
  },
  setError(errMsg) {
    const setError = () => {
      this.error(errMsg);
      this.errorSection.collapse('show');
    };

    if (!this.collapse.hasClass('in')) {
      this.collapse.collapse('show');

      this.collapse.on('shown.bs.collapse', () => {
        setError();
      });
    } else {
      setError();
    }
  },
  clearError() {
    this.error('');
    this.errorSection.collapse('hide');
  },
  hasError() {
    return !!this.error();
  },
  save() {
    const insertData = this.getData();
    if (insertData) {
      this.callInsert(this.insertFn, insertData);
    }
  },
  delete() {
    this.removeFn(this);
  },
  destroy() {
    Blaze.remove(this.templateInstance.view);
  },
  update({ e = {}, withFocusCheck = false, ...args }, cb) {
    const _id = this._id && this._id();
    if (!_id) {
      return;
    }

    if (_.keys(args).every(key => this.data()[key] === args[key])) {
      return;
    }

    const updateFn = () => {
      this.callUpdate(this.updateFn, {
        _id,
        ...args,
      }, cb);
    };

    if (withFocusCheck) {
      this.isWaiting(true);
      this.callWithFocusCheck(e, updateFn);
    } else {
      updateFn();
    }
  },
  getData() {
    const child = this.child(this.content());
    return child && child.getData && child.getData();
  },
});
