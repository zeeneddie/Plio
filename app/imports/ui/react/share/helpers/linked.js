import curry from 'lodash.curry';

import { mapC, propEq, find, every, reduceC } from '/imports/api/helpers';
import { getQueryParams } from '/imports/api/work-items/helpers';
import { getPath } from '/imports/ui/utils/router';
import { getClassByStatus as getActionClassByStatus } from '/imports/api/actions/helpers';

export const getLinkedActions = curry(({ userId, workItems }, actions) => mapC((action) => {
  const workItem = find(propEq('linkedDoc._id', action._id), workItems);
  const href = ((() => {
    if (!workItem) return '#';

    const params = { workItemId: workItem._id };
    const queryParams = getQueryParams(workItem)(userId);

    return getPath('workInboxItem')(params, queryParams);
  })());
  return {
    ...action,
    href,
    indicator: getActionClassByStatus(action.status),
  };
}, actions));

export const getLinkedLessons = curry((docId, docType, lessons) => reduceC((prev, lesson) => {
  const pred = every([
    propEq('documentId', docId),
    propEq('documentType', docType),
  ], lesson);

  if (pred) return prev.concat({ ...lesson, sequentialId: `LL${lesson.serialNumber}` });

  return prev;
}, [], lessons));
