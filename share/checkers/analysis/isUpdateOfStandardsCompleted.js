import { eqUpdateOfStandardsStatus } from 'plio-util';
import { ANALYSIS_STATUSES } from '../../constants';

// ({ updateOfStandards: Object }: Object) => Boolean
export default eqUpdateOfStandardsStatus(ANALYSIS_STATUSES.COMPLETED);
