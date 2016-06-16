import { Template } from 'meteor/templating';

import { Standards } from '/imports/api/standards/standards.js';
import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { Occurrences } from '/imports/api/occurrences/occurrences.js';

Template.NCCard.viewmodel({
  mixin: ['organization', 'nonconformity', 'user', 'date', 'utils', 'modal', 'currency', 'NCStatus', 'collapse'],
  autorun() {
    this.templateInstance.subscribe('improvementPlan', this.NCId());
  },
  NC() {
    return this._getNCByQuery({ _id: this.NCId() });
  },
  NCs() {
    return this._getNCsByQuery({});
  },
  hasNCs() {
    return this.NCs().count() > 0;
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
  renderCost(cost) {
    const currency = this.organization() && this.organization().currency;
    return currency ? this.getCurrencySymbol(currency) + cost : '';
  },
  occurrences() {
    const query = { nonConformityId: this.NCId() };
    return Occurrences.find(query);
  },
  openEditNCModal() {
    this.modal().open({
      title: 'Non-conformity',
      template: 'EditNC',
      _id: this.NCId()
    });
  }
});
