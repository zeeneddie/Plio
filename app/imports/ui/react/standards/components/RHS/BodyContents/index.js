import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

import propTypes from './propTypes';
import { propEqId } from '/imports/api/helpers';
import _user_ from '/imports/startup/client/mixins/user';
import _problemsStatus_ from '/imports/startup/client/mixins/problemsStatus';
import _actionStatus_ from '/imports/startup/client/mixins/actionStatus';
import _workInbox_ from '/imports/startup/client/mixins/workInbox';
import { ActionTypes } from '/imports/share/constants';
import createReadFields from '../../../../helpers/createReadFields';
import DepartmentsContainer from '../../../../fields/read/containers/DepartmentsContainer';
import Source from '../../../../fields/read/components/Source';
import Notify from '../../../../fields/read/components/Notify';
import LinkItemList from '../../../../fields/read/components/LinkItemList';
import IP from '../../../../fields/read/components/IP';

const StandardsRHSBodyContents = ({
  description,
  issueNumber,
  owner,
  departmentsIds = [],
  source1,
  source2,
  notify,
  improvementPlan,
  orgSerialNumber,
  ncs = [],
  risks = [],
  actions = [],
  section = {},
  type = {},
  workItems = [],
  lessons = [],
}) => {
  const wrap = 'col-md-6';
  const data = [
    { label: 'Description', text: description },
    { label: 'Issue number', text: issueNumber, wrap },
    { label: 'Section', text: section.title, wrap },
    { label: 'Type', text: type.title, wrap },
    { label: 'Owner', text: _user_.userNameOrEmail(owner), wrap },
  ];
  const fields = createReadFields(data);
  const ncsMapped = ncs.map(nc => ({
    ...nc,
    indicator: _problemsStatus_.getClassByStatus(nc.status),
    href: FlowRouter.path(
      'nonconformity',
      { orgSerialNumber, urlItemId: nc._id },
      { filter: 1 }
    ),
  }));
  const risksMapped = risks.map(risk => ({
    ...risk,
    indicator: _problemsStatus_.getClassByStatus(risk.status),
    href: FlowRouter.path(
      'risk',
      { orgSerialNumber, riskId: risk._id },
      { filter: 1 },
    ),
  }));
  const actionsMapped = actions.map(action => {
    const workItem = Object.assign({}, workItems.find(({ linkedTo = [] }) =>
      linkedTo.find(propEqId(action._id))));
    const params = { orgSerialNumber, workItemId: workItem._id };
    const queryParams = _workInbox_._getQueryParams(workItem);

    return {
      ...action,
      indicator: _actionStatus_.getClassByStatus(action.status),
      href: FlowRouter.path('workInboxItem', params, queryParams),
    };
  });
  const actionsByType = _workInbox_._splitActionsByType(actionsMapped);
  const lessonsMapped = lessons.map(ll => ({ ...ll, sequentialId: `LL${ll.serialNumber}` }));

  return (
    <div>
      <div className="list-group">
        {fields.description}

        <div className="row">
          {fields.issueNumber}
          {fields.section}
        </div>

        <div className="row">
          {fields.type}
          {fields.owner}
        </div>

        {departmentsIds.length ? (
          <DepartmentsContainer departmentsIds={departmentsIds} />
        ) : null}

        {source1 ? (
          <Source {...source1} id={1} />
        ) : null}

        {source2 ? (
          <Source {...source2} id={2} />
        ) : null}
      </div>

      {notify ? (<Notify users={[...notify]} />) : null}

      {ncs.length ? (
        <LinkItemList
          label="Non-conformities"
          items={ncsMapped}
          orgSerialNumber={orgSerialNumber}
        />
      ) : null}

      {risks.length ? (
        <LinkItemList
          label="Risks"
          items={risksMapped}
          orgSerialNumber={orgSerialNumber}
        />
      ) : null}

      {actionsByType[ActionTypes.CORRECTIVE_ACTION].length ? (
        <LinkItemList
          label="Corrective actions"
          items={actionsByType[ActionTypes.CORRECTIVE_ACTION]}
          orgSerialNumber={orgSerialNumber}
        />
      ) : null}

      {actionsByType[ActionTypes.PREVENTATIVE_ACTION].length ? (
        <LinkItemList
          label="Preventative actions"
          items={actionsByType[ActionTypes.PREVENTATIVE_ACTION]}
          orgSerialNumber={orgSerialNumber}
        />
      ) : null}

      {improvementPlan ? (
        <IP
          label="Improvement Plan"
          {...improvementPlan}
        />
      ) : null}

      {lessons.length ? (
        <LinkItemList
          label="Lessons learned"
          items={lessonsMapped}
          orgSerialNumber={orgSerialNumber}
        />
      ) : null}

    </div>
  );
};

StandardsRHSBodyContents.propTypes = propTypes;

export default StandardsRHSBodyContents;
