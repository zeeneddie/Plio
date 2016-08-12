import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Standards } from '/imports/api/standards/standards.js';
import { StandardFilters } from '/imports/api/constants.js';

Template.StandardsHeader.viewmodel({
  share: ['window', 'search'],
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
    if ($(window).width() < 768) {
      const params = {
        orgSerialNumber: this.organizationSerialNumber(),
        standardId: this.standardId()
      };
      const queryParams = { by: this.activeStandardFilter() };

      this.width(null);
      return FlowRouter.go('standard', params, queryParams);
    } else if (this.isDiscussionOpened()) {
      this.width(null);
    }

    return this.navigate(e);
  }
});
