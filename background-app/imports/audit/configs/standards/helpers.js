import { getUserId } from '../../utils/helpers.js';


export const getReceivers = function({ newDoc, user }) {
  const { owner } = newDoc;
  const userId = getUserId(user);

  return (owner !== userId) ? [owner]: [];
};
