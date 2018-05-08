import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { map, assoc } from 'ramda';

import { DocumentTypes, ProblemTypes } from '../../../../../../../share/constants';
import { client } from '../../../../../../../client/apollo';
import { Query } from '../../../../../../../client/graphql';

const mapToDocType = (documentType, array) => map(assoc('documentType', documentType), array);

Template.Actions_LinkedTo_Read.viewmodel({
  mixin: ['organization', 'nonconformity', 'risk', 'utils', 'problemsStatus'],
  linkedTo: [],
  goals: [],
  onRendered() {
    this.fetchGoals();
  },
  showStatusIcon({ documentType }) {
    return Object.values(ProblemTypes).includes(documentType);
  },
  fetchGoals() {
    client.query({
      query: Query.GOAL_LIST,
      variables: {
        organizationId: this.organizationId(),
      },
    }).then(({ data: { goals: { goals = [] } = {} } }) => {
      this.goals(goals);
    });
  },
  linkedDocs() {
    const ids = Array.from(this.linkedTo() || []).map(({ documentId }) => documentId);
    const query = { _id: { $in: ids } };
    const options = { sort: { serialNumber: 1 } };
    const ncs = mapToDocType(DocumentTypes.NON_CONFORMITY, this._getNCsByQuery(query, options));
    const risks = mapToDocType(DocumentTypes.RISK, this._getRisksByQuery(query, options));
    const goals = mapToDocType(
      DocumentTypes.GOAL,
      this.goals().filter(goal => ids.includes(goal._id)),
    );
    return ncs.concat(risks).concat(goals);
  },
  getLink({ _id, documentType }) {
    const getRoute = (routeName, params) => FlowRouter.path(routeName, {
      ...params,
      orgSerialNumber: this.organizationSerialNumber(),
    });

    switch (documentType) {
      case DocumentTypes.NON_CONFORMITY:
        return getRoute('nonconformity', { urlItemId: _id });
      case DocumentTypes.RISK:
        return getRoute('risk', { urlItemId: _id });
      case DocumentTypes.GOAL:
        return getRoute('dashboardPage');
      default:
        return '#';
    }
  },
});
