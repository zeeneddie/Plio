import { Template } from 'meteor/templating';

import { Problems } from '/imports/api/problems/problems.js';
import { NCTypes } from '/imports/api/constants.js';

Template.NCList.viewmodel({
  share: 'search',
  mixin: ['search', 'collapsing', 'organization', 'modal', 'magnitude', 'nonconformity', 'router'],
  autorun() {
    this.searchText.depend();

    const sections = ViewModel.find('NCSectionItem');

    if (sections.length > 0) {
      const results = sections.reduce((prev, cur) => prev + cur.NCs().count(), 0);
      this.searchResultsNumber(results);
    }
  },
  onRendered() {
    this.expandCollapsed(this.NCId());

    const organizationId = this.organizationId();
    const query = { type: 'non-conformity', organizationId };

    const contains = !!this.NCId() && Problems.findOne({ ...query, _id: this.NCId(), isDeleted: { $in: [null, false] } });

    if (!contains) {
      const nc = Problems.findOne({ ...query, isDeleted: { $in: [null, false] } }, { sort: { serialNumber: 1 } });
      if (nc) {
        const { _id } = nc;
        Meteor.setTimeout(() => {
          this.goToNC(_id);
        }, 0);
      }
    }
  },
  openAddNCModal() {
    this.modal().open({
      title: 'Non-conformity',
      template: 'CreateNC',
      variation: 'save'
    });
  }
});
