import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { ProblemTypes } from '/imports/api/constants.js';

Template.Subcards_Actions_Read.viewmodel({
  mixin: ['organization', 'workInbox', 'actionStatus', 'nonconformity', 'risk', 'utils'],
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

    return this._getActionsByQuery(query, options).map((action) => {
      const workItem = this._getWorkItemByQuery({ 'linkedDoc._id': action._id });
      const href = !workItem ? '#' : ((() => {
        const params = { orgSerialNumber: this.organizationSerialNumber(), workItemId: workItem._id };
        const queryParams = this._getQueryParams(workItem)(Meteor.userId());
        return FlowRouter.path('workInboxItem', params, queryParams);
      })());
      return { ...action, href };
    });
  }
});
