import { DocumentTypes } from '/imports/share/constants';

export const ROUTE_MAP = {
  STANDARDS: 'standards',
  NON_CONFORMITIES: 'non-conformities',
  RISKS: 'risks',
  ACTIONS: 'actions',
  GOALS: 'goals',
};

export const DOCUMENT_TYPE_BY_ROUTE_MAP = {
  [ROUTE_MAP.STANDARDS]: DocumentTypes.STANDARD,
  [ROUTE_MAP.NON_CONFORMITIES]: DocumentTypes.NON_CONFORMITY,
  [ROUTE_MAP.RISKS]: DocumentTypes.RISK,
  [ROUTE_MAP.ACTIONS]: DocumentTypes.CORRECTIVE_ACTION,
  [ROUTE_MAP.GOALS]: DocumentTypes.GOAL,
};
