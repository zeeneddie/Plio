import PropTypes from 'prop-types';
import React from 'react';

import Block from '/imports/client/react/fields/read/components/Block';
import { ActionTypes } from '../../../../../../../share/constants';
import { getClassByStatus } from '../../../../../../../api/problems/helpers';
import { splitActionsByType } from '../../../../../../../api/actions/helpers';
import LinkItemList from '../../../../../fields/read/components/LinkItemList';
import { getPath } from '../../../../../../../ui/utils/router/paths';
import Lessons from '../../../../../fields/read/components/Lessons';

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
        <Block key={`list-${label}`}>
          <span>{label}</span>
          <LinkItemList {...{ items }} />
        </Block>
      ))}
      {props.children}
      {props.lessons && !!props.lessons.length && (
        <Lessons lessons={props.lessons} />
      )}
    </div>
  );
};

ConnectedDocList.propTypes = {
  ncs: PropTypes.array,
  risks: PropTypes.array,
  actions: PropTypes.array,
  lessons: PropTypes.array,
  children: PropTypes.node,
};

export default ConnectedDocList;
