import { Template } from 'meteor/templating';
import invoke from 'lodash.invoke';

import { Standards } from '/imports/share/collections/standards.js';
import { StandardFilters } from '/imports/api/constants.js';
import { isMobileRes } from '/imports/api/checkers.js';

Template.StandardsHeader.viewmodel({
  share: 'window',
  mixin: ['standard', 'organization', 'router'],
  isDiscussionOpened: false,
  headerArgs() {
    return {
      idToExpand: this.standardId(),
      header: `Standards`,
      prependWith: 'by',
      prependIndexes: [0, 1],
      filters: StandardFilters,
      isActiveFilter: this.isActiveStandardFilter.bind(this),
      onSelectFilter: this.onSelectFilter.bind(this)
    };
  },
  standard() {
    return this._getStandardByQuery({ _id: this.standardId() });
  },
  onSelectFilter(value, onSelect) {
    const list = Object.assign({}, ViewModel.findOne('StandardsList'));

    onSelect();

    if (list) {
      invoke(list, 'handleRoute');
    }
  },
  onNavigate(e) {
    const mobileWidth = isMobileRes();
    const goToDashboard = () => this.goToDashboard(this.organizationSerialNumber());

    if (mobileWidth) {
      this.width(mobileWidth);
      return this.goToStandard(this.standardId());
    }

    return goToDashboard();
  }
});
