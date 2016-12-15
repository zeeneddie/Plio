import { connect } from 'react-redux';

import BodyContents from '../../components/RHS/BodyContents';

const mapStateToProps = ((state, { sectionId, typeId }) => ({
  section: state.collections.standardBookSectionsByIds[sectionId],
  type: state.collections.standardTypesByIds[typeId],
}));

export default connect(mapStateToProps)(BodyContents);
