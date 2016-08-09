import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';

import { updateViewedBy } from '/imports/api/risks/methods.js';

Template.Risks_Item.viewmodel({
  share: 'window',
  mixin: ['risk', 'date', 'riskScore', 'organization'],
  onCreated(template) {
    template.autorun((computation) => {
      if (this._id() === this.riskId() && this.isNew()) {
        Tracker.nonreactive(() => this.updateViewedBy(() => computation.stop()));
      }
    });
  },
  _id: '',
  identifiedAt: '',
  identifiedBy: '',
  magnitude: '',
  sequentialId: '',
  type: '',
  status: '',
  title: '',
  score: '',
  viewedBy: [],
  getHref() {
    const params = { orgSerialNumber: this.organizationSerialNumber(), riskId: this._id() };
    const queryParams = { by: this.activeRiskFilter() };
    return FlowRouter.path('risk', params, queryParams);
  },
  isNew() {
    return this.viewedBy() && !this.viewedBy().find(_id => _id === Meteor.userId());
  },
  updateViewedBy(cb) {
    const _id = this._id();

    updateViewedBy.call({ _id }, cb);
  },
  navigate() {
    if ($(window).width() < 768) {
      this.width($(window).width());
    }

    FlowRouter.setParams({ riskId: this._id() });
  }
});
