import { HomeScreenTypes } from '../../../share/constants';

export const CUSTOMER_SEQUENTIAL_ID = 'CU';

export const SignupPaths = {
  [HomeScreenTypes.OPERATIONS]: 'Plio Operations',
  [HomeScreenTypes.CANVAS]: 'Plio Canvas',
  [undefined]: 'Plio Operations',
};
