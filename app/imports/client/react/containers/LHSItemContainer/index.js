import { memo } from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import { pickDeep } from '/imports/api/helpers';
import LHSItem from '../../components/LHSItem';

export default compose(
  memo,
  connect(pickDeep(['global.collapsed'])),
)(LHSItem);
