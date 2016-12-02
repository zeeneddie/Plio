import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';

import { pickDeep } from '/imports/api/helpers';
import StandardsLHSStandardList from '../../components/StandardsLHSStandardList';

export default compose(
  connect(pickDeep([
    'organizations.organization',
    'organizations.orgSerialNumber',
    'global.userId',
    'global.filter',
    'global.urlItemId',
  ])),
)(StandardsLHSStandardList);
