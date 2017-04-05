import { getUserId } from '../../utils/helpers';


export const getReceivers = function (doc, user) {
  const notify = doc.notify || [];
  const index = notify.indexOf(getUserId(user));

  return index > -1
    ? notify.slice(0, index).concat(notify.slice(index + 1))
    : [...notify];
};
