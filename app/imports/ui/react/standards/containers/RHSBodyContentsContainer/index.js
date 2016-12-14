import { compose } from 'recompose';
import { connect } from 'react-redux';

import BodyContents from '../../components/RHS/BodyContents';

export default compose(
  connect((_, { sectionId, typeId }) => (state) => ({
    section: state.collections.standardBookSectionsByIds[sectionId],
    type: state.collections.standardTypesByIds[typeId],
  })),
)(BodyContents);
