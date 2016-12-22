import { createPathGetter } from './helpers';

export const getPathToStandard = createPathGetter('standard');

export const getPathToDiscussion = createPathGetter('standardDiscussion');

export const getPathToNC = createPathGetter('nonconformity');

export const getPathToRisk = createPathGetter('risk', 'riskId');

export const getPathToWorkItem = createPathGetter('workInboxItem', 'workItemId');

export const getPathToCustomer = createPathGetter('customer');
