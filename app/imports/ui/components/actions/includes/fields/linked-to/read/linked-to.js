import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { ProblemTypes } from '/imports/share/constants.js';

Template.Actions_LinkedTo_Read.viewmodel({
  mixin: ['organization', 'nonconformity', 'risk', 'utils', 'problemsStatus'],
  linkedTo: '',
  linkedDocs() {
    const ids = Array.from(this.linkedTo() || []).map(({ documentId }) => documentId);
    const query = { _id: { $in: ids } };
    const options = { sort: { serialNumber: 1 } };
    const mapToDocType = (documentType) => {
      return ({ ...args }) => {
        return {
          documentType,
          ...args
        };
      };
    };
    const NCs = this._getNCsByQuery(query, options).map(mapToDocType(ProblemTypes.NON_CONFORMITY));
    const risks = this._getRisksByQuery(query, options).map(mapToDocType(ProblemTypes.RISK));
    return NCs.concat(risks);
  },
  getLink({ _id, documentType }) {
    const getRoute = (routeName, params) => {
      return FlowRouter.path(routeName, { ...params, orgSerialNumber: this.organizationSerialNumber() });
    };

    switch(documentType) {
      case ProblemTypes.NON_CONFORMITY:
        return getRoute('nonconformity', { nonconformityId: _id });
        break;
      case ProblemTypes.RISK:
        return getRoute('risk', { riskId: _id });
        break;
      default:
        return "#";
        break;
    }
  }
});
