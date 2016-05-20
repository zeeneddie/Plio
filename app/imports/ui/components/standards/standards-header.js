import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Standards } from '/imports/api/standards/standards.js';
import { StandardFilters } from '/imports/api/constants.js';

Template.StandardsHeader.viewmodel({
  share: [{ listItems: 'listItems' }, 'standard', 'window'],
  mixin: ['standard', 'collapsing', 'organization'],
  selectedFilter: '',
  autorun: [
    function() {
      this.selectedFilter.depend();
      if (this.listItems._rendered()) {
        this.expandCollapsedStandard(this.standardId());
      }
    },
    function() {
      if (this.selectedFilter()) {
        FlowRouter.setQueryParams({ by: this.selectedFilter() });
      }
    }
  ],
  standardFilters() {
    return StandardFilters;
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
