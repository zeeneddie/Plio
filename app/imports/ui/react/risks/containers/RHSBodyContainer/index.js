import { connect } from 'react-redux';

import BodyContents from '../../components/RHS/Body';

const mapStateToProps = ((state, { departmentId, typeId, risk }) => ({
  departments: state.collections.departmentsByIds[departmentId],
  type: state.collections.riskTypesByIds[typeId],
  notify: risk.notify
    ? risk.notify.map(userId => {
      const { profile: { firstName, lastName } } = state.collections.usersByIds[userId];

      return { userId, firstName, lastName };
    }) : [],
}));

export default connect(mapStateToProps)(BodyContents);
