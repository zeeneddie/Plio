import { getUserId } from '../../utils/helpers.js';


export const getReceivers = function({ newDoc, user }) {
  const { notify } = newDoc;
  const index = notify.indexOf(getUserId(user));

  return index > -1
    ? notify.slice(0, index).concat(notify.slice(index + 1))
    : [...notify];
};

export const getReceiversForIPReviewDate = function({ newDoc, user }) {
  const { owner:IPOwnerId } = newDoc.improvementPlan;
  let receivers = getReceivers({ newDoc, user });

  if (IPOwnerId && (IPOwnerId !== getUserId(user))) {
    const index = receivers.indexOf(IPOwnerId);

    if (index === -1) {
      receivers = [...receivers, IPOwnerId];
    }
  }

  return receivers;
};
