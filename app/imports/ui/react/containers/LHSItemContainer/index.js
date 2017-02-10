import { compose, pure } from 'recompose';
import { connect } from 'react-redux';

import { pickDeep } from '/imports/api/helpers';
import LHSItem from '../../components/LHSItem';

export default compose(
  pure,
  connect(pickDeep(['global.collapsed'])),
)(LHSItem);
