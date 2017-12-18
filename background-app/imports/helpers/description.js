import get from 'lodash.get';

import {
  ActionTypes,
  ProblemTypes,
  HomeScreenTitlesTypes,
  DocumentTypes,
} from '/imports/share/constants';

// actions
export const getCADesc = () => 'corrective action';

export const getPADesc = () => 'preventative action';

export const getRCDesc = () => 'risk control';

export const getActionDesc = (docType) => {
  const descFn = {
    [ActionTypes.CORRECTIVE_ACTION]: getCADesc,
    [ActionTypes.PREVENTATIVE_ACTION]: getPADesc,
    [ActionTypes.RISK_CONTROL]: getRCDesc,
  }[docType];

  return descFn ? descFn() : 'action';
};

export const getActionName = doc => `${doc.sequentialId} "${doc.title}"`;

// problems
export const getNCDesc = () => 'nonconformity';

export const getRiskDesc = () => 'risk';

export const getProblemDesc = (problemType) => {
  const descFn = {
    [ProblemTypes.NON_CONFORMITY]: getNCDesc,
    [ProblemTypes.RISK]: getRiskDesc,
  }[problemType];

  return descFn && descFn();
};

export const getProblemName = doc => `${doc.sequentialId} "${doc.title}"`;

// standards
export const getStandardDesc = () => 'standard';

export const getStandardName = doc => `"${doc.title}"`;
