import createDecorator from 'final-form-calculate';

import { WorkflowTypes } from '../../../../share/constants';

const updateIsVerification = (value, { isCompleted, workflowType }) => {
  console.log('isCompleted', isCompleted);
  return isCompleted && workflowType === WorkflowTypes.SIX_STEP;
};

export default createDecorator(
  {
    field: 'isCompleted',
    updates: {
      isVerification: updateIsVerification,
    },
  },
  {
    field: 'workflowType',
    updates: {
      isVerification: updateIsVerification,
    },
  },
);
