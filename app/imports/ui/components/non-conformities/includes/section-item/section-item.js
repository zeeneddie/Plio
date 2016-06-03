import { Template } from 'meteor/templating';

import { Problems } from '/imports/api/problems/problems.js';

Template.NCSectionItem.viewmodel({
  share: 'search',
  mixin: ['organization', 'search'],
  magnitude: '',
  NCs() {
    const organizationId = this.organizationId();
    const query = { ...this.searchObject('searchText', [{ name: 'title' }, { name: 'sequentialId' }]),
                    organizationId,
                    type: 'non-conformity',
                    magnitude: this.magnitude() };

    const options = { sort: { title: 1 } };

    return Problems.find(query, options);
  }
});
