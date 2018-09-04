import { connect } from 'react-redux';

import RisksList from '../../components/RisksList';
import {
  getOrgSerialNumber,
  getOrganization,
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

export default connect(mapStateToProps)(RisksList);
