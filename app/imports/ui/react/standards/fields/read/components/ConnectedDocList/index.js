import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout'; 

import { ActionTypes } from '/imports/share/constants';
import { splitActionsByType } from '/imports/api/actions/helpers';
import LinkItemList from '../../../../../fields/read/components/LinkItemList';
import { getPath } from '../../../../../../utils/router/paths';
import { getClassByStatus } from '/imports/api/problems/helpers';

const ConnectedDocList = (props) => {
  const ncs = props.ncs.map(({
    title,
    sequentialId,
    status,
    _id,
  }) => {
    const href = getPath('nonconformity')({ urlItemId: _id });
    return {
      _id,
      title,
      sequentialId,
      href,
      indicator: getClassByStatus(status),
      // when opening nonconformities blaze screen from standards react screen
      // it just doesn't work the normal way
      onMouseUp: (e) => {
        e.preventDefault();
        ReactDOM.unmountComponentAtNode(document.getElementById('app'));
        BlazeLayout.reset();
        FlowRouter.go(href);
      },
    };
  });
  const risks = props.risks.map(risk => ({
    ...risk,
    indicator: getClassByStatus(risk.status),
    href: getPath('risk')({ urlItemId: risk._id }),
  }));
  const actionsByType = splitActionsByType(props.actions);

  const lists = [
    {
      label: 'Nonconformities',
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
      {lists.map(({ label, items = [] }) => !!items.length && (
        <LinkItemList key={`list-${label}`} {...{ label, items }} />
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
