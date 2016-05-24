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
      if (!!this.selectedStandardId() && !!this.listItems._rendered()) {
        this.expandCollapsedStandard(this.selectedStandardId());
      }
    },
    function() {
      if (!this.selectedStandardId() && !!this.standardId()) {
        this.selectedStandardId(this.standardId());
      }
    },
    function() {
      if (!this.standardId() && !this.selectedStandardId()) {
        const standard = Standards.findOne({}, { sort: { createdAt: 1 } });
        if (!!standard) {
          const orgSerialNumber = this.organization().serialNumber;
          const { _id } = standard;

          Meteor.setTimeout(() => {
            FlowRouter.go('standard', { orgSerialNumber: this.organization().serialNumber, standardId: _id });

            this.selectedStandardId(_id);

            this.expandCollapsedStandard(_id);
          }, 0);
        }
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
