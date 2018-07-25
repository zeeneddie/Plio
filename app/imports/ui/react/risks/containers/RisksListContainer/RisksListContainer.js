import { connect } from 'react-redux';

import RisksList from '../../components/RisksList';
import {
  getOrgSerialNumber,
  getOrganization,
} from '../../../../../client/store/selectors/organizations';
import {
  getUserId,
  getFilter,
  getUrlItemId,
} from '../../../../../client/store/selectors/global';

const mapStateToProps = state => ({
  organization: getOrganization(state),
  orgSerialNumber: getOrgSerialNumber(state),
  userId: getUserId(state),
  filter: getFilter(state),
  urlItemId: getUrlItemId(state),
});

export default connect(mapStateToProps)(RisksList);
