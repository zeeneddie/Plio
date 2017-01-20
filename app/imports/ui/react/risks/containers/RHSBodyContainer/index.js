import { connect } from 'react-redux';

import BodyContents from '../../components/RHS/Body';

const mapStateToProps = ((state, { departmentId, typeId }) => ({
  departments: state.collections.departmentsByIds[departmentId],
  type: state.collections.riskTypesByIds[typeId],
}));

export default connect(mapStateToProps)(BodyContents);
