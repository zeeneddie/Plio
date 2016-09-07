import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Standards } from '/imports/api/standards/standards.js';
import { StandardFilters } from '/imports/api/constants.js';
import { isMobileRes } from '/imports/api/checkers.js';

Template.StandardsHeader.viewmodel({
  share: ['window', 'search'],
  mixin: ['standard', 'collapsing', 'filters', 'organization', 'mobile', 'router'],
  isDiscussionOpened: false,
  headerArgs() {
    const filters = Object.keys(StandardFilters).map((key) => ({
      text: StandardFilters[key],
      value: key
    }));
    const isActiveFilter = this.isActiveStandardFilter.bind(this);
    const filter = filters.find(({ value }) => isActiveFilter(value));
    const header = `Compliance standards by - ${filter.text}`;

    return {
      header,
      filters,
      isActiveFilter,
      onSelectFilter: (value) => {
        FlowRouter.setQueryParams({ filter: value });
        this.searchText('');
        this.expandCollapsed(this.standardId());
      },
      onNavigate: this.onNavigate.bind(this)
    };
  },
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
    const mobileWidth = isMobileRes();
    const goToDashboard = () => this.goToDashboard(this.organizationSerialNumber());

    if (mobileWidth) {
      if (this.isDiscussionOpened()) {
        this.width(mobileWidth);
        return this.goToStandard(this.standardId());
      } else {
        if (this.width()) {
          return this.width(null);
        } else {
          return goToDashboard();
        }
      }
    }

    return goToDashboard();
  }
});
