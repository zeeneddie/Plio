import React, { PropTypes } from 'react';

import { ActionTypes } from '/imports/share/constants';
import { splitActionsByType } from '/imports/ui/react/actions/helpers';
import LinkItemList from '../../../../../fields/read/components/LinkItemList';
import _problemsStatus_ from '/imports/startup/client/mixins/problemsStatus';
import _actionStatus_ from '/imports/startup/client/mixins/actionStatus';
import _workInbox_ from '/imports/startup/client/mixins/workInbox';
import { getPath } from '../../../../../../utils/router/paths';
import { propEq } from '/imports/api/helpers';

// TODO: change param to urlItemId for every route

const ConnectedDocList = (props) => {
  const ncs = props.ncs.map(nc => ({
    ...nc,
    indicator: _problemsStatus_.getClassByStatus(nc.status),
    href: getPath('nonconformity')({ urlItemId: nc._id }),
  }));
  const risks = props.risks.map(risk => ({
    ...risk,
    indicator: _problemsStatus_.getClassByStatus(risk.status),
    href: getPath('risk')({ riskId: risk._id }),
  }));
  const actions = props.actions.map((action) => {
    const workItem = props.workItems.find(propEq('linkedDoc._id', action._id));
    const href = ((() => {
      if (!workItem) return '#';

      const params = { workItemId: workItem._id };
      const queryParams = _workInbox_._getQueryParams(workItem)(props.userId);

      return getPath('workInboxItem')(params, queryParams);
    })());
    return {
      ...action,
      href,
      indicator: _actionStatus_.getClassByStatus(action.status),
    };
  });
  const actionsByType = splitActionsByType(actions);

  const lists = [
    {
      label: 'Non-conformities',
      items: [...ncs],
    },
    {
      label: 'Risks',
      items: [...risks],
    },
    {
      label: 'Corrective actions',
      items: [...actionsByType[ActionTypes.CORRECTIVE_ACTION]],
    },
    {
      label: 'Preventative actions',
      items: [...actionsByType[ActionTypes.PREVENTATIVE_ACTION]],
    },
  ];

  return (
    <div>
      {lists.map(({ label, items = [] }, i) => !!items.length && (
        <LinkItemList key={i} {...{ label, items }} />
      ))}
      {props.children}
      {props.lessons && !!props.lessons.length && (
        <LinkItemList label="Lessons Learned" items={props.lessons} />
      )}
    </div>
  );
};

ConnectedDocList.propTypes = {
  userId: PropTypes.string,
  ncs: PropTypes.array,
  risks: PropTypes.array,
  actions: PropTypes.array,
  workItems: PropTypes.array,
  lessons: PropTypes.array,
  children: PropTypes.node,
};

export default ConnectedDocList;
