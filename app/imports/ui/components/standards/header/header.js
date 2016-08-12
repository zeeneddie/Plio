import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Standards } from '/imports/api/standards/standards.js';
import { StandardFilters } from '/imports/api/constants.js';

Template.StandardsHeader.viewmodel({
  share: ['standard', 'window', 'search'],
  mixin: ['standard', 'collapsing', 'organization', 'mobile'],
  isDiscussionOpened: false,
  standard() {
    return this._getStandardByQuery({ _id: this.standardId() });
  },
  standardFilters() {
    return StandardFilters;
  },
  selectFilter(filter) {
    FlowRouter.setQueryParams({ by: filter });
    this.searchText('');
    this.expandCollapsed(this.standardId());
  },
  onNavigate(e) {
    if (this.isDiscussionOpened()) {
      return FlowRouter.go('dashboardPage', { orgSerialNumber: this.organizationSerialNumber() });
    }

    return this.navigate(e);
  }
});
