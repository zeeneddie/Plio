import { view } from 'ramda';

import { lenses } from '../../../util';

export const getRisksInitializing = view(lenses.risks.initializing);

export const getRisksAreDepsReady = view(lenses.risks.areDepsReady);

export const getSelectedRisk = state => state.collections.risksByIds[state.global.urlItemId];

export const getRisksFiltered = view(lenses.risks.risksFiltered);

export const getRisks = view(lenses.collections.risks);

export const getRisksByIds = view(lenses.collections.risksByIds);
