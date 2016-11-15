import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

import propTypes from './propTypes';
import { propEq, propEqId } from '/imports/api/helpers';
import _user_ from '/imports/startup/client/mixins/user';
import _problemsStatus_ from '/imports/startup/client/mixins/problemsStatus';
import _actionStatus_ from '/imports/startup/client/mixins/actionStatus';
import _workInbox_ from '/imports/startup/client/mixins/workInbox';
import { ActionTypes } from '/imports/share/constants';
import createReadFields from '../../../helpers/createReadFields';
import DepartmentsReadContainer from '../../../containers/DepartmentsReadContainer';
import SourceRead from '../../../components/SourceRead';
import NotifyRead from '../../../components/NotifyRead';
import FieldReadLinkItemList from '../../../components/FieldReadLinkItemList';

const StandardsRHSBodyContents = ({
  description,
  issueNumber,
  owner,
  departmentsIds = [],
  source1,
  source2,
  notify,
  orgSerialNumber,
  ncs = [],
  risks = [],
  actions = [],
  section = {},
  type = {},
  files = [],
  workItems = [],
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
      { orgSerialNumber, nonconformityId: nc._id },
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

        {departmentsIds.length && (<DepartmentsReadContainer departmentsIds={departmentsIds} />)}

        {source1 ? (
          <SourceRead
            {...source1}
            id={1}
            file={files.find(propEqId(source1.fileId))}
          />
        ) : null}

        {source2 ? (
          <SourceRead
            {...source2}
            id={2}
            file={files.find(propEqId(source2.fileId))}
          />
        ) : null}
      </div>

      {notify ? (<NotifyRead users={[...notify]} />) : null}

      {ncs.length ? (
        <FieldReadLinkItemList
          label="Non-conformities"
          items={ncsMapped}
          orgSerialNumber={orgSerialNumber}
        />
      ) : null}

      {risks.length ? (
        <FieldReadLinkItemList
          label="Risks"
          items={risksMapped}
          orgSerialNumber={orgSerialNumber}
        />
      ) : null}

      {actionsByType[ActionTypes.CORRECTIVE_ACTION].length ? (
        <FieldReadLinkItemList
          label="Corrective actions"
          items={actionsByType[ActionTypes.CORRECTIVE_ACTION]}
          orgSerialNumber={orgSerialNumber}
        />
      ) : null}

      {actionsByType[ActionTypes.PREVENTATIVE_ACTION].length ? (
        <FieldReadLinkItemList
          label="Preventative actions"
          items={actionsByType[ActionTypes.PREVENTATIVE_ACTION]}
          orgSerialNumber={orgSerialNumber}
        />
      ) : null}

    </div>
  );
};

StandardsRHSBodyContents.propTypes = propTypes;

export default StandardsRHSBodyContents;
