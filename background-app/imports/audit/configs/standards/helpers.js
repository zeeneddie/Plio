import { getUserId } from '../../utils/helpers.js';


export const getReceivers = function({ newDoc, user }) {
  const { notify } = newDoc;
  const index = notify.indexOf(getUserId(user));

  return index > -1
    ? notify.slice(0, index).concat(notify.slice(index + 1))
    : [...notify];
};
