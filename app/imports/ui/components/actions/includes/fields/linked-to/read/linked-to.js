import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { NonConformities } from '/imports/api/non-conformities/non-conformities.js';
import { Risks } from '/imports/api/risks/risks.js';

Template.Actions_LinkedTo_Read.viewmodel({
  mixin: ['organization', 'utils'],
  linkedDocs: '',
  getLink({ _id }) {
    const collection = this.getCollectionInstance(_id, NonConformities, Risks);
    switch(collection) {
      case NonConformities:
        return this.getRoute('nonconformity', { nonconformityId: _id });
        break;
      case Risks:
        return this.getRoute('risk', { riskId: _id });
        break;
      default:
        return '#';
        break;
    }
  },
  getRoute(to, params) {
    return FlowRouter.path(to, { ...params, orgSerialNumber: this.organizationSerialNumber() });
  }
});
