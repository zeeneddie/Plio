import { compose, withProps, setPropTypes } from 'recompose';
import { PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';

import _problemsStatus_ from '/imports/startup/client/mixins/problemsStatus';
import NCsRead from '../../components/NCsRead';

export default compose(
  setPropTypes({
    ncs: PropTypes.arrayOf(PropTypes.object).isRequired,
    orgSerialNumber: PropTypes.number.isRequired,
  }),
  withProps((props) => {
    const newNcs = props.ncs
      .filter(nc => !nc.isDeleted && props.ids.includes(nc._id))
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
      ncs: newNcs,
    };
  }),
)(NCsRead);
