import { _ } from 'meteor/underscore';

import { getUserId } from '../../utils/helpers';


export const getReceivers = function ({ newDoc, user }) {
  const { owner } = newDoc;
  const userId = getUserId(user);

  return (owner !== userId) ? [owner] : [];
};

export const getReceiversForIPReviewDate = function ({ newDoc, user }) {
  const { owner: standardOwnerId } = newDoc;
  const { owner: IPOwnerId } = newDoc.improvementPlan;
  const userId = getUserId(user);

  const receivers = new Set();
  _([standardOwnerId, IPOwnerId]).each((_id) => {
    if (_id && (_id !== userId)) {
      receivers.add(_id);
    }
  });

  return Array.from(receivers);
};
