import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Standards } from '/imports/api/standards/standards.js';
import { StandardFilters } from '/imports/api/constants.js';

Template.StandardsHeader.viewmodel({
  share: [{ listItems: 'listItems' }, 'standard', 'window'],
  mixin: ['standard', 'collapsing', 'organization'],
  onDestroyed() {
    this.selectedStandardId('');
  },
  autorun: [
    function() {
      this.activeStandardFilter();
      if (!!this.selectedStandardId() && !!this.listItems._rendered()) {
        this.expandCollapsedStandard(this.selectedStandardId());
      }
    },
    function() {
      if (!this.selectedStandardId() && !!this.standardId()) {
        this.selectedStandardId(this.standardId());
      } else if (!!this.selectedStandardId() && !this.standardId() && this.organizationSerialNumber()) {
        FlowRouter.go('standard', { orgSerialNumber: this.organizationSerialNumber(), standardId: this.selectedStandardId() });
      }
    },
    function() {
      const standard = Standards.findOne({}, { sort: { createdAt: 1 } });

      if (!this.standardId() && !this.selectedStandardId() && !!standard && this.organizationSerialNumber()) {
        const { _id } = standard;

        this.selectedStandardId(_id);

        FlowRouter.go('standard', { orgSerialNumber: this.organizationSerialNumber(), standardId: _id });
      }
    }
  ],
  standardFilters() {
    return StandardFilters;
  },
  selectFilter(filter) {
    FlowRouter.setQueryParams({ by: filter });
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
