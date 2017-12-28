import { view, compose } from 'ramda';

import { lenses } from '../../../util';

export const getRisksInitializing = view(lenses.risks.initializing);

export const getRisksAreDepsReady = view(lenses.risks.areDepsReady);

export const getSelectedRisk = state => state.collections.risksByIds[state.global.urlItemId];

export const getSelectedRiskIsDeleted = compose(
  view(lenses.isDeleted),
  getSelectedRisk,
);

export const getRisksFiltered = view(lenses.risks.risksFiltered);

export const getRisks = view(lenses.collections.risks);

export const getRisksByIds = view(lenses.collections.risksByIds);

export const getRisksFromProps = (_, { risks }) => risks;

export const getIsViewed = ({ global: { userId } }, { viewedBy }) => viewedBy.includes(userId);
