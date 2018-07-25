import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import invoke from 'lodash.invoke';
import moment from 'moment-timezone';

import { ActionUndoTimeInHours } from '../../../../../../share/constants';
import { canCompletionBeUndone } from '../../../../../../api/actions/checkers';

Template.Actions_CompletedBy.viewmodel({
  organizationId: '',
  isCompleted: true,
  isVerified: false,
  completedBy: '',
  completedAt: '',
  placeholder: 'Completed by',
  selectFirstIfNoSelected: false,
  enabled: true,
  currentTime: '',
  undoDeadline: '',
  onCreated() {
    this.currentTime(Date.now());

    this.interval = Meteor.setInterval(() => {
      this.currentTime(Date.now());
    }, 10 * 1000);
  },
  autorun() {
    if (this.completedAt()) {
      const undoDeadline = new Date(this.completedAt().getTime());
      undoDeadline.setHours(undoDeadline.getHours() + ActionUndoTimeInHours);
      this.undoDeadline(undoDeadline);
    }
  },
  onDestroyed() {
    this.clearInterval();
  },
  selectArgs() {
    const { completedBy: value, placeholder, selectFirstIfNoSelected } = this.data();
    const disabled = this.isDisabled();

    return {
      value,
      placeholder,
      selectFirstIfNoSelected,
      disabled,
      onUpdate: (viewmodel) => {
        const { selected: completedBy } = viewmodel.getData();

        this.completedBy(completedBy);

        invoke(this.parent(), 'update', { completedBy });
      },
    };
  },
  clearInterval() {
    Meteor.clearInterval(this.interval);
  },
  onUndo() {},
  undo() {
    return (...args) => this.onUndo(...args);
  },
  canBeUndone() {
    this.currentTime.depend();

    const organizationId = this.organizationId();
    const isCompleted = this.isCompleted();
    const isVerified = this.isVerified();
    const completedAt = this.completedAt();
    const completedBy = this.completedBy();
    const action = {
      isCompleted,
      isVerified,
      completedAt,
      completedBy,
      organizationId,
    };
    const userId = Meteor.userId();
    return this.enabled() && canCompletionBeUndone(action, userId);
  },
  passedFromCompleted() {
    return moment(this.completedAt()).from(this.currentTime());
  },
  leftToUndo() {
    return moment(this.undoDeadline()).to(this.currentTime(), true);
  },
  isDisabled() {
    return !this.enabled();
  },
  getData() {
    return { completedBy: this.completedBy() };
  },
});
