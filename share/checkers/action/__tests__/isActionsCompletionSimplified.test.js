import { ActionTypes } from '../../../constants';
import isActionsCompletionSimplified from '../isActionsCompletionSimplified';

describe('isActionsCompletionSimplified', () => {
  const userId = 1;
  const action = {
    type: ActionTypes.CORRECTIVE_ACTION,
    createdBy: userId,
    toBeCompletedBy: userId,
  };
  const organization = {
    workflowDefaults: {
      isActionsCompletionSimplified: true,
    },
  };

  it('passes', () => {
    expect(isActionsCompletionSimplified(action, userId, organization)).toBe(true);
  });

  it('fails if simplified completion of own actions is disabled', () => {
    const org = {
      workflowDefaults: {
        isActionsCompletionSimplified: false,
      },
    };

    expect(isActionsCompletionSimplified(action, userId, org)).toBe(false);
  });

  it('fails if action type is not corrective or preventative', () => {
    const act = Object.assign({}, action, {
      type: ActionTypes.GENERAL_ACTION,
    });

    expect(isActionsCompletionSimplified(act, userId, organization)).toBe(false);
  });

  it('fails if the user did not create the action', () => {
    const act = Object.assign({}, action, {
      createdBy: 2,
    });

    expect(isActionsCompletionSimplified(act, userId, organization)).toBe(false);
  });

  it('fails if the user is not assigned to complete the action', () => {
    const act = Object.assign({}, action, {
      toBeCompletedBy: 2,
    });

    expect(isActionsCompletionSimplified(act, userId, organization)).toBe(false);
  });
});
