import { connect } from 'react-redux';

import BodyContents from '../../components/RHS/BodyContents';
import {
  getStandardBookSectionBySectionId,
} from '../../../../../client/store/selectors/standardBookSections';
import { getStandardTypeByTypeId } from '../../../../../client/store/selectors/standardTypes';
import { getUsersByIds } from '../../../../../client/store/selectors/users';
import { pickDocuments } from '../../../../../api/helpers';

const mapStateToProps = (state, props) => {
  const usersByIds = getUsersByIds(state);
  const { owner, improvementPlan = {}, notify } = props;

  return {
    section: getStandardBookSectionBySectionId(state, props),
    type: getStandardTypeByTypeId(state, props),
    owner: usersByIds[owner],
    improvementPlan: {
      ...improvementPlan,
      owner: usersByIds[improvementPlan.owner],
    },
    notify: pickDocuments(['_id', 'profile', 'emails'], usersByIds, notify),
  };
};

export default connect(mapStateToProps)(BodyContents);
