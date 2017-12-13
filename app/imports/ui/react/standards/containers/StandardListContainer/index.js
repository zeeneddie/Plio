import { connect } from 'react-redux';

import StandardList from '../../components/StandardList';
import { getStandardListData } from '../../../../../client/store/selectors/standards';

export default connect(getStandardListData)(StandardList);
