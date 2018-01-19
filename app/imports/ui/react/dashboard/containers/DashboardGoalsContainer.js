import { identity } from 'ramda';

import { namedCompose } from '../../helpers';
import { DashboardGoals } from '../components';

export default namedCompose('DashboardGoalsContainer')(
  identity,
)(DashboardGoals);
