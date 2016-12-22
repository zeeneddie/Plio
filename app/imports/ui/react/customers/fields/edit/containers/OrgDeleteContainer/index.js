import { compose, withHandlers, branch, renderNothing } from 'recompose';
import { connect } from 'react-redux';
import property from 'lodash.property';

import { pickDeep, identity } from '/imports/api/helpers';
import { onOrgDelete } from './handlers';
import { isPlioAdmin } from '/imports/api/checkers';
import OrgDelete from '../../components/OrgDelete';

export default compose(
  connect(pickDeep(['global.userId'])),
  branch(
    compose(isPlioAdmin, property('userId')),
    identity,
    renderNothing,
  ),
  withHandlers({ onOrgDelete }),
)(OrgDelete);
