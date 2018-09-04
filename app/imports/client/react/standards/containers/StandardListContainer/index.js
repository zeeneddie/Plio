import { connect } from 'react-redux';

import StandardList from '../../components/StandardList';
import {
  getOrganization,
  getOrgSerialNumber,
} from '../../../../store/selectors/organizations';
import {
  getUserId,
  getFilter,
  getUrlItemId,
} from '../../../../store/selectors/global';

const mapStateToProps = state => ({
  organization: getOrganization(state),
  orgSerialNumber: getOrgSerialNumber(state),
  userId: getUserId(state),
  filter: getFilter(state),
  urlItemId: getUrlItemId(state),
});

export default connect(mapStateToProps)(StandardList);
