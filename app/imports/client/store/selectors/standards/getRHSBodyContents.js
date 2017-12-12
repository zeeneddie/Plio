import { createSelector } from 'reselect';

import { getStandardBookSectionsByIds } from '../standardBookSections';
import { getStandardTypesByIds } from '../standardTypes';
import { getUsersByIds } from '../users';
import pickDocuments from '../../../../api/helpers/pickDocuments';

const selector = ({
  sectionId,
  typeId,
  owner,
  notify,
  improvementPlan = {},
} = {}) => (
  standardBookSectionsByIds,
  standardTypesByIds,
  usersByIds,
) => ({
  section: standardBookSectionsByIds[sectionId],
  type: standardTypesByIds[typeId],
  owner: usersByIds[owner],
  improvementPlan: {
    ...improvementPlan,
    owner: usersByIds[improvementPlan.owner],
  },
  notify: pickDocuments(['_id', 'profile', 'emails'], usersByIds, notify),
});

export default props => createSelector([
  getStandardBookSectionsByIds,
  getStandardTypesByIds,
  getUsersByIds,
], selector(props));
