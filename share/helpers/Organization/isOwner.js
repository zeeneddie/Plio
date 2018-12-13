import { whereEq } from 'ramda';

import { UserMembership } from '../../constants';

export default whereEq({ isRemoved: false, role: UserMembership.ORG_OWNER });
