import { connect } from 'react-redux';

import BodyContents from '../../components/RHS/BodyContents';
import { getRHSBodyContents } from '../../../../../client/store/selectors/standards';

export default connect((state, props) => getRHSBodyContents(props)(state))(BodyContents);
