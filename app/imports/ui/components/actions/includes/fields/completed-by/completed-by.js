import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { ActionUndoTimeInHours } from '/imports/api/constants.js';


Template.Actions_CompletedBy.viewmodel({
  mixin: ['search', 'user', 'members'],
  completedBy: '',
  placeholder: 'Completed by',
  selectFirstIfNoSelected: false,
  enabled: true,
  currentDate: '',
  undoDeadline: '',
  onCreated() {
    this.interval = Meteor.setInterval(() => {
      this.currentDate(new Date());
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
    const currentDate = this.currentDate();
    const undoDeadline = this.undoDeadline();

    let isTimeLeftToUndo = false;
    if ((currentDate instanceof Date) && (undoDeadline instanceof Date)) {
      isTimeLeftToUndo = currentDate < undoDeadline;
    }

    return isTimeLeftToUndo && (this.completedBy() === Meteor.userId()) && this.enabled();
  },
  passedFromCompleted() {
    return moment(this.completedAt()).from(this.currentDate());
  },
  leftToUndo() {
    return moment(this.undoDeadline()).to(this.currentDate(), true);
  },
  getData() {
    return { completedBy: this.completedBy() };
  }
});
