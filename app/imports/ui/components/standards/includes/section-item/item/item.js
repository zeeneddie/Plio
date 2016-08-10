import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Tracker } from 'meteor/tracker';

import { StandardTypes } from '/imports/api/standards-types/standards-types.js';
import { updateViewedBy } from '/imports/api/standards/methods.js';

Template.Standards_Item_Read.viewmodel({
  share: 'window',
  mixin: ['organization', 'standard', 'user', 'date'],
  title: '',
  sectionId: '',
  typeId: '',
  owner: '',
  issueNumber: '',
  status: 'issued',
  nestingLevel: 1,
  viewedBy: [],
  notify: '',
  onCreated(template) {
    template.autorun((computation) => {
      if (this._id() === this.standardId() && this.isNew()) {
        Tracker.nonreactive(() => this.updateViewedBy(() => computation.stop()));
      }
    });
  },
  standardType() {
    const typeId = this.typeId && this.typeId();
    return StandardTypes.findOne({ _id: typeId });
  },
  typeName() {
    return this.standardType() && this.standardType().name;
  },
  getHref() {
    const params = { orgSerialNumber: this.organizationSerialNumber(), standardId: this._id() };
    const queryParams = { by: this.activeStandardFilter() };
    return FlowRouter.path('standard', params, queryParams);
  },
  isNew() {
    return this.viewedBy && !this.viewedBy().find(_id => _id === Meteor.userId());
  },
  select() {
    if ($(window).width() < 768) {
      this.width($(window).width());
    }

    FlowRouter.setParams({ standardId: this._id() });
  },
  updateViewedBy(cb) {
    const _id = this._id();

    updateViewedBy.call({ _id }, cb);
  }
});
