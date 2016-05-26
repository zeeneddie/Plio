import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Standards } from '/imports/api/standards/standards.js';
import { StandardFilters } from '/imports/api/constants.js';

Template.StandardsHeader.viewmodel({
  share: ['standard', 'window'],
  mixin: ['standard', 'collapsing', 'organization'],
  autorun() {
    const query = this.isActiveStandardFilter('deleted') ? { isDeleted: true } : {};
    const options = { sort: { createdAt: -1 } };
    const standard = Standards.findOne(query, options);

    if (!this.standardId() && !!standard && this.organizationSerialNumber()) {
      const { _id } = standard;

      FlowRouter.go('standard', { orgSerialNumber: this.organizationSerialNumber(), standardId: _id }, { by: this.activeStandardFilter() });
    }
  },
  standardFilters() {
    return StandardFilters;
  },
  selectFilter(filter) {
    FlowRouter.setQueryParams({ by: filter });
    this.expandCollapsedStandard(this.standardId());
  },
  navigate(e) {
    e.preventDefault();

    if (this.width() && this.width() < 768) {
      this.width(null);
    } else {
      FlowRouter.go('dashboardPage', { orgSerialNumber: this.organization().serialNumber });
    }
  }
});
