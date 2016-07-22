import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { ProblemTypes } from '/imports/api/constants.js';

Template.Subcards_Actions_Read.viewmodel({
  mixin: ['organization', 'action', 'actionStatus', 'nonconformity', 'risk', 'utils'],
  type: '',
  documentId: '',
  standardId: '',
  actions() {
    const { type, documentId, standardId } = this.data();
    let query = { type };
    const options = { sort: { serialNumber: 1 } };

    if (documentId) {
      query = { ...query, 'linkedTo.documentId': documentId };
    } else if (standardId) {
      const pQuery = { standardsIds: standardId };

      const NCsIds = this._getNCsByQuery(pQuery).map(({ _id }) => _id);
      const risksIds = this._getRisksByQuery(pQuery).map(({ _id }) => _id);

      query = {
        ...query,
        $or: [
          { 'linkedTo.documentId': { $in: NCsIds }, 'linkedTo.documentType': ProblemTypes.NC },
          { 'linkedTo.documentId': { $in: risksIds }, 'linkedTo.documentType': ProblemTypes.RISK }
        ]
      };
    }

    return this._getActionsByQuery(query, options).map(({ _id, toBeCompletedBy, toBeVerifiedBy, isCompleted, isVerified, ...args }) => {
      const href = ((() => {
        const params = { orgSerialNumber: this.organizationSerialNumber(), workItemId: _id };
        const queryParams = this._getQueryParams({ toBeCompletedBy, toBeVerifiedBy, isCompleted, isVerified })(Meteor.userId());
        return FlowRouter.path('workInboxItem', params, queryParams);
      })());
      return { _id, toBeCompletedBy, toBeVerifiedBy, isCompleted, isVerified, href, ...args };
    });
  }
});
