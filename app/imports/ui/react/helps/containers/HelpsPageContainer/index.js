import { connect } from 'react-redux';
import { compose } from 'recompose';

import { pickDeep } from '/imports/api/helpers';
import HelpsPage from '../../components/HelpsPage';

export default compose(
  connect(pickDeep(['organizations.organization'])),
)(HelpsPage);
