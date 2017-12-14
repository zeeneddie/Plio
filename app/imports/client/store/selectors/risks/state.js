import { view } from 'ramda';

import { lenses } from '../../../util';

export const getRisksInitializing = view(lenses.risks.initializing);

export const getRisksAreDepsReady = view(lenses.risks.areDepsReady);

export const getSelectedRisk = state => state.collections.risksByIds[state.global.urlItemId];
