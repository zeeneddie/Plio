import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Standards } from '/imports/api/standards/standards.js';
import { StandardFilters } from '/imports/api/constants.js';

Template.StandardsHeader.viewmodel({
  share: ['window', 'search'],
  mixin: ['standard', 'collapsing', 'filters', 'organization', 'mobile'],
  isDiscussionOpened: false,
  standard() {
    return this._getStandardByQuery({ _id: this.standardId() });
  },
  filters() {
    return this.mapFilters(StandardFilters);
  },
  currentFilterLabel() {
    return this.getStandardFilterLabel(this.activeStandardFilterId());
  },
  selectFilter(filterId) {
    FlowRouter.setQueryParams({ filter: filterId });
    this.searchText('');
    this.expandCollapsed(this.standardId());
  },
  onNavigate(e) {
    if ($(window).width() < 768) {
      const params = {
        orgSerialNumber: this.organizationSerialNumber(),
        standardId: this.standardId()
      };
      const queryParams = { filter: this.activeStandardFilterId() };

      this.width(null);
      return FlowRouter.go('standard', params, queryParams);
    } else if (this.isDiscussionOpened()) {
      this.width(null);
    }

    return this.navigate(e);
  }
});
