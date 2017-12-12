import { createSelector } from 'reselect';

import { getStandardBookSectionsByIds } from '../standardBookSections';
import { getStandardTypesByIds } from '../standardTypes';
import { getUsersByIds } from '../users';
import pickDocuments from '../../../../api/helpers/pickDocuments';

/*
  interface improvementPlan {
    owner: ID
  }

  selector({
    sectionId: ID,
    typeId: ID,
    owner: ID,
    notify: [...ID],
    improvementPlan
  }) => (
    standardBookSectionsByIds: Object,
    standardTypesByIds: Object,
    usersByIds: Object
  ) => Object
*/

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
