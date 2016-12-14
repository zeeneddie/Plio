import React, { PropTypes } from 'react';
import property from 'lodash.property';
import { compose } from 'recompose';

import { ActionTypes } from '/imports/share/constants';
import { splitActionsByType } from '/imports/ui/react/actions/helpers';
import LinkItemList from '../../../../../fields/read/components/LinkItemList';
import _problemsStatus_ from '/imports/startup/client/mixins/problemsStatus';
import _actionStatus_ from '/imports/startup/client/mixins/actionStatus';
import _workInbox_ from '/imports/startup/client/mixins/workInbox';
import { getPathToNC, getPathToRisk, getPathToWorkItem } from '../../../../../helpers/routeHelpers';
import { propEqId } from '/imports/api/helpers';

// TODO: work items are not publishing

const ConnectedDocList = (props) => {
  const ncs = props.ncs.map(nc => ({
    ...nc,
    indicator: _problemsStatus_.getClassByStatus(nc.status),
    href: getPathToNC({ urlItemId: nc._id }),
  }));
  const risks = props.risks.map(risk => ({
    ...risk,
    indicator: _problemsStatus_.getClassByStatus(risk.status),
    href: getPathToRisk({ urlItemId: risk._id }),
  }));
  const actions = props.actions.map((action) => {
    const workItem = {
      ...props.workItems.find(compose(find(propEqId(action._id)), property('linkedTo'))),
    };
    const params = { urlItemId: workItem._id };
    const queryParams = _workInbox_._getQueryParams(workItem);

    return {
      ...action,
      indicator: _actionStatus_.getClassByStatus(action.status),
      href: getPathToWorkItem(params, queryParams),
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
      <LinkItemList label="Lessons Learned" items={props.lessons} />
    </div>
  );
};

ConnectedDocList.propTypes = {
  ncs: PropTypes.array,
  risks: PropTypes.array,
  actions: PropTypes.array,
  workItems: PropTypes.array,
  lessons: PropTypes.array,
  children: PropTypes.node,
};

export default ConnectedDocList;
