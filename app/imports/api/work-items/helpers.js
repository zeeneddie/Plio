import { Meteor } from 'meteor/meteor';

import { Actions, Risks, NonConformities } from '../../share/collections';
import { WorkItemsStore } from '../../share/constants';

export const getClassByStatus = (status) => {
  switch (status) {
    case 0:
      return 'default';
    case 1:
      return 'warning';
    case 2:
      return 'danger';
    case 3:
      return 'success';
    default:
      return 'default';
  }
};

export const getQueryParams = ({ isCompleted, assigneeId }, currentUserId) => {
  const assignee = assigneeId || currentUserId || Meteor.userId();
  return (userId) => {
    if (isCompleted) { // completed
      if (assignee === userId) {
        return { filter: 3 }; // My completed work
      }

      return { filter: 4 }; // Team completed work
    }

    if (assignee === userId) {
      return { filter: 1 }; // My current work
    }

    return { filter: 2 }; // Team current work
  };
};

// ({ _id: String, type: String }: Object) => MongoDocument
export const getLinkedDoc = ({ _id, type }) => {
  const { LINKED_TYPES } = WorkItemsStore;

  const collections = {
    [LINKED_TYPES.NON_CONFORMITY]: NonConformities,
    [LINKED_TYPES.RISK]: Risks,
    [LINKED_TYPES.CORRECTIVE_ACTION]: Actions,
    [LINKED_TYPES.PREVENTATIVE_ACTION]: Actions,
    [LINKED_TYPES.RISK_CONTROL]: Actions,
  };

  const collection = collections[type];

  return collection ? collection.findOne({ _id }) : undefined;
};
