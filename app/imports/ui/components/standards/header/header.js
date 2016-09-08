import { Template } from 'meteor/templating';

import { Standards } from '/imports/api/standards/standards.js';
import { StandardFilters } from '/imports/api/constants.js';
import { isMobileRes } from '/imports/api/checkers.js';

Template.StandardsHeader.viewmodel({
  share: 'window',
  mixin: ['standard', 'organization', 'router'],
  isDiscussionOpened: false,
  headerArgs() {
    return {
      idToExpand: this.standardId(),
      header: `Compliance standards by -`,
      filters: StandardFilters,
      isActiveFilter: this.isActiveStandardFilter.bind(this),
      onNavigate: this.onNavigate.bind(this)
    };
  },
  standard() {
    return this._getStandardByQuery({ _id: this.standardId() });
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
