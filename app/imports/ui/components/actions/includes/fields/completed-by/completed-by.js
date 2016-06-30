import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { ActionUndoTimeInHours } from '/imports/api/constants.js';


Template.Actions_CompletedBy.viewmodel({
  mixin: ['search', 'user', 'members'],
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
  clearInterval() {
    Meteor.clearInterval(this.interval);
  },
  onUpdateCb() {
    return this.update.bind(this);
  },
  update(viewmodel) {
    const { selected:completedBy } = viewmodel.getData();

    this.completedBy(completedBy);

    this.parent().update && this.parent().update({ completedBy });
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
  getData() {
    return { completedBy: this.completedBy() };
  }
});
