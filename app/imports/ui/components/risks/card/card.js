import { Template } from 'meteor/templating';

import { RiskTypes } from '/imports/api/risk-types/risk-types.js';
import { Standards } from '/imports/api/standards/standards.js';

Template.RisksCard.viewmodel({
  mixin: ['organization', 'risk', 'problemsStatus', 'utils', 'user', 'date'],
  hasRisks() {
    return this.risks().count() > 0;
  },
  risks() {
    const list = ViewModel.findOne('RisksList');
    const query = list && list._getQueryForFilter();
    return this._getRisksByQuery(query);
  },
  risk() {
    return this._getRiskByQuery({ _id: this.riskId() });
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
  renderType(_id) {
    const type = RiskTypes.findOne({ _id });
    return !!type ? type.title : '';
  }
});
