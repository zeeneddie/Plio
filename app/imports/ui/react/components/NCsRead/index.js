import React from 'react';
import { withProps } from 'recompose';
import { FlowRouter } from 'meteor/kadira:flow-router';

import _problemsStatus_ from '/imports/startup/client/mixins/problemsStatus';
import propTypes from './propTypes';
import FieldRead from '../FieldRead';
import FieldReadBlock from '../FieldReadBlock';
import FieldReadLinkItem from '../FieldReadLinkItem';

const NCsRead = ({ ncs }) => (
  <FieldReadBlock label="Non-conformities">
    <FieldRead>
      {ncs.map((nc) => (
        <FieldReadLinkItem key={nc._id} {...nc} />
      ))}
    </FieldRead>
  </FieldReadBlock>
);

NCsRead.propTypes = propTypes;

export default withProps((props) => {
  const ncs = props.ncs
    .map(nc => ({
      ...nc,
      indicator: _problemsStatus_.getClassByStatus(nc.status),
      href: FlowRouter.path(
        'nonconformity',
        { orgSerialNumber: props.orgSerialNumber, nonconformityId: nc._id },
        { filter: 1 }
      ),
    }));

  return {
    ...props,
    ncs,
  };
})(NCsRead);
