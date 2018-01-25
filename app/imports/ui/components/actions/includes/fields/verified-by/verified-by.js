import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import invoke from 'lodash.invoke';
import moment from 'moment-timezone';

import { ActionUndoTimeInHours } from '../../../../../../share/constants';
import { canVerificationBeUndone } from '../../../../../../api/actions/checkers';

Template.Actions_VerifiedBy.viewmodel({
  mixin: ['search', 'user', 'members'],
  verifiedBy: '',
  verifiedAt: '',
  organizationId: '',
  isCompleted: true,
  isVerified: true,
  placeholder: 'Verified by',
  selectFirstIfNoSelected: false,
  currentTime: '',
  undoDeadline: '',
  onCreated() {
    this.currentTime(Date.now());
    this.interval = Meteor.setInterval(() => {
      this.currentTime(Date.now());
    }, 10 * 1000);
  },
  autorun() {
    const undoDeadline = new Date(this.verifiedAt().getTime());
    undoDeadline.setHours(undoDeadline.getHours() + ActionUndoTimeInHours);
    this.undoDeadline(undoDeadline);
  },
  onDestroyed() {
    this.clearInterval();
  },
  clearInterval() {
    Meteor.clearInterval(this.interval);
  },
  selectArgs() {
    const {
      verifiedBy: value,
      placeholder,
      selectFirstIfNoSelected,
    } = this.data();

    return {
      value,
      placeholder,
      selectFirstIfNoSelected,
      onUpdate: (viewmodel) => {
        const { selected: verifiedBy } = viewmodel.getData();

        this.verifiedBy(verifiedBy);

        return invoke(this.parent(), 'update', { verifiedBy });
      },
    };
  },
  canBeUndone() {
    this.currentTime.depend();

    const organizationId = this.organizationId();
    const isCompleted = this.isCompleted();
    const isVerified = this.isVerified();
    const verifiedAt = this.verifiedAt();
    const verifiedBy = this.verifiedBy();

    const action = {
      isCompleted,
      isVerified,
      verifiedAt,
      verifiedBy,
      organizationId,
    };
    const userId = Meteor.userId();
    return canVerificationBeUndone(action, userId);
  },
  onUndo() {},
  undo() {
    return (...args) => this.onUndo(...args);
  },
  passedFromVerified() {
    return moment(this.verifiedAt()).from(this.currentTime());
  },
  leftToUndo() {
    return moment(this.undoDeadline()).to(this.currentTime(), true);
  },
  getData() {
    return { verifiedBy: this.verifiedBy() };
  },
});
