import { getTitle } from 'plio-util';

import {
  ActionTypes,
  ProblemTypes,
} from '../share/constants';

// actions
export const getCADesc = () => 'corrective action';

export const getPADesc = () => 'preventative action';

export const getRCDesc = () => 'risk control';

export const getGADesc = () => 'general action';

export const getActionDesc = (docType) => {
  const descFn = {
    [ActionTypes.CORRECTIVE_ACTION]: getCADesc,
    [ActionTypes.PREVENTATIVE_ACTION]: getPADesc,
    [ActionTypes.RISK_CONTROL]: getRCDesc,
    [ActionTypes.GENERAL_ACTION]: getGADesc,
  }[docType];

  return descFn ? descFn() : 'action';
};

export const getActionName = doc => `${doc.sequentialId} "${doc.title}"`;

// problems
export const getNCDesc = () => 'nonconformity';

export const getRiskDesc = () => 'risk';

export const getPGDesc = () => 'potential gain';

export const getProblemDesc = (problemType) => {
  const descFn = {
    [ProblemTypes.NON_CONFORMITY]: getNCDesc,
    [ProblemTypes.POTENTIAL_GAIN]: getPGDesc,
    [ProblemTypes.RISK]: getRiskDesc,
  }[problemType];

  return descFn && descFn();
};

export const getProblemName = doc => `${doc.sequentialId} "${doc.title}"`;

// standards
export const getStandardDesc = () => 'standard';

export const getStandardName = doc => `"${doc.title}"`;

// goals
export const getGoalDesc = () => 'key goal';
export const getGoalName = getTitle;

// milestones
export const getMilestoneDesc = () => 'milestone';
export const getMilestoneName = getTitle;
