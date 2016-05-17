import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Standards } from '/imports/api/standards/standards.js';
import { StandardFilters } from '/imports/api/constants.js';

Template.StandardsHeader.viewmodel({
  share: { listItems: 'listItems' },
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
  }
});
