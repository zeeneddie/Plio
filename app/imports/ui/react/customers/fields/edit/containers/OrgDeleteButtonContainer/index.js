import React from 'react';
import { compose, withHandlers, branch, renderNothing } from 'recompose';
import { connect } from 'react-redux';
import property from 'lodash.property';

import { pickDeep, identity } from '/imports/api/helpers';
import Button from '../../../../../components/Buttons/Button';
import { handleOrgDelete } from './handlers';
import { isPlioAdmin } from '/imports/api/checkers';

export default compose(
  connect(pickDeep(['global.userId'])),
  branch(
    compose(isPlioAdmin, property('userId')),
    identity,
    renderNothing,
  ),
  withHandlers({ onClick: handleOrgDelete }),
)(({ onClick }) => (
  <Button type="secondary" {...{ onClick }}>Delete</Button>
));
