
import { getUserId } from '../../utils/helpers';
import { getOwnerId } from '../../../share/helpers/Organization';

export const getReceivers = function (doc, user) {
  const executorId = getUserId(user);
  const ownerId = getOwnerId(doc);

  return executorId === ownerId ? [] : [ownerId];
};
