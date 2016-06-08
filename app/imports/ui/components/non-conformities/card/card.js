import { Template } from 'meteor/templating';

import { Standards } from '/imports/api/standards/standards.js';
import { Problems } from '/imports/api/problems/problems.js';
import { Occurences } from '/imports/api/occurences/occurences.js';

Template.NCCard.viewmodel({
  mixin: ['organization', 'nonconformity', 'user', 'date', 'utils', 'modal', 'currency', 'NCStatus'],
  autorun() {
    this.templateInstance.subscribe('standards', this.organizationId());
    this.templateInstance.subscribe('improvementPlan', this.NCId());
  },
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
  getStatus(status) {
    return status || 1;
  },
  linkedStandard(_id) {
    const standard = Standards.findOne({ _id });
    if (standard) {
      const { title } = standard;
      const href = ((() => {
        const orgSerialNumber = this.organizationSerialNumber();
        const standardId = _id;
        return FlowRouter.path('standard', { orgSerialNumber, standardId });
      })());
      return { title, href };
    }
  },
  renderCost({ value, currency } = {}) {
    return this.getCurrencySymbol(currency) + value;
  },
  occurences() {
    const query = { nonConformityId: this.NCId() };
    return Occurences.find(query);
  },
  openEditNCModal() {
    this.modal().open({
      title: 'Non-conformity',
      template: 'EditNC',
      _id: this.NCId()
    });
  }
});
