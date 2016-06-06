import { Template } from 'meteor/templating';

import { Problems } from '/imports/api/problems/problems.js';

Template.NCCard.viewmodel({
  mixin: ['organization', 'nonconformity', 'user', 'date', 'utils'],
  NC() {
    const organizationId = this.organizationId();
    const _id = this.NCId();
    const type = 'non-conformity';

    const query = { organizationId, _id, type };
    return Problems.findOne(query);
  },
  NCs() {
    const organizationId = this.organizationId();
    const type = 'non-conformity';

    const query = { organizationId, type };
    const options = { sort: { title: 1 } };

    return Problems.find(query, options);
  },
  linkedStandard(_id) {

  }
});
