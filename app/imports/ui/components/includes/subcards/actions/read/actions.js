import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';

import { extractIds } from '/imports/api/helpers';
import { ProblemTypes } from '/imports/share/constants.js';

Template.Subcards_Actions_Read.viewmodel({
  mixin: ['organization', 'workInbox', 'actionStatus', 'nonconformity', 'risk', 'utils'],
  type: '',
  documentId: '',
  standardId: '',
  label() {
    return `${this._getNameByType(this.type())}s`;
  },
  actions() {
    const { type, documentId, standardId } = this.data();
    let query = { type, isDeleted: { $in: [null, false] } };
    const options = { sort: { serialNumber: 1 } };

    if (documentId) {
      query = { ...query, 'linkedTo.documentId': documentId };
    } else if (standardId) {
      const pQuery = { standardsIds: standardId };

      const NCsIds = extractIds(this._getNCsByQuery(pQuery));
      const risksIds = extractIds(this._getRisksByQuery(pQuery));

      query = {
        ...query,
        $or: [
          {
            'linkedTo.documentId': { $in: NCsIds },
            'linkedTo.documentType': ProblemTypes.NON_CONFORMITY,
          },
          { 'linkedTo.documentId': { $in: risksIds }, 'linkedTo.documentType': ProblemTypes.RISK },
        ],
      };
    }

    const actions = this._getActionsByQuery(query, options).fetch();

    return actions.map((action) => {
      const workItem = this._getWorkItemByQuery({ 'linkedDoc._id': action._id });
      const href = !workItem ? '#' : ((() => {
        const params = {
          orgSerialNumber: this.organizationSerialNumber(),
          workItemId: workItem._id,
        };
        const queryParams = this._getQueryParams(workItem)(Meteor.userId());
        return FlowRouter.path('workInboxItem', params, queryParams);
      })());
      return { ...action, href };
    });
  },
});
