import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';

import { updateViewedBy } from '/imports/api/risks/methods.js';

Template.RiskItem.viewmodel({
  share: 'window',
  mixin: ['risk', 'date'],
  autorun() {
    if (this._id() === this.riskId() && this.isNew()) {
      Tracker.nonreactive(() => this.updateViewedBy());
    }
  },
  identifiedAt: '',
  identifiedBy: '',
  magnitude: '',
  sequentialId: '',
  type: '',
  status: '',
  title: '',
  viewedBy: [],
  isNew() {
    return !this.viewedBy().find(_id => _id === Meteor.userId());
  },
  updateViewedBy() {
    const _id = this._id();

    updateViewedBy.call({ _id });
  },
  navigate() {
    if ($(window).width() < 768) {
      this.width($(window).width());
    }

    FlowRouter.setParams({ riskId: this._id() });
  }
});
