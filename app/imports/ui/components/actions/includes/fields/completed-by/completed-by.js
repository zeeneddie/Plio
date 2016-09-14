import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import invoke from 'lodash.invoke';

import { ActionUndoTimeInHours } from '/imports/api/constants.js';


Template.Actions_CompletedBy.viewmodel({
  completedBy: '',
  completedAt: '',
  placeholder: 'Completed by',
  selectFirstIfNoSelected: false,
  enabled: true,
  currentTime: '',
  undoDeadline: '',
  onCreated() {
    this.interval = Meteor.setInterval(() => {
      this.currentTime(Date.now());
    }, 1000);
  },
  autorun() {
    const undoDeadline = new Date(this.completedAt().getTime());
    undoDeadline.setHours(undoDeadline.getHours() + ActionUndoTimeInHours);
    this.undoDeadline(undoDeadline);
  },
  onDestroyed() {
    this.clearInterval();
  },
  selectArgs() {
    const { completedBy:value, placeholder, selectFirstIfNoSelected } = this.data();
    const disabled = this.isDisabled();

    return {
      value,
      placeholder,
      selectFirstIfNoSelected,
      disabled,
      onUpdate: (viewmodel) => {
        const { selected:completedBy } = viewmodel.getData();

        this.completedBy(completedBy);

        invoke(this.parent(), 'update', { completedBy });
      }
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
    const currentTime = this.currentTime();
    const undoDeadline = this.undoDeadline();

    let isTimeLeftToUndo = false;
    if (_.isDate(undoDeadline) && _.isFinite(currentTime)) {
      isTimeLeftToUndo = currentTime < undoDeadline;
    }

    return isTimeLeftToUndo && (this.completedBy() === Meteor.userId()) && this.enabled();
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
  }
});
