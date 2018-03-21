import { eqAnalysisStatus } from 'plio-util';
import { ANALYSIS_STATUSES } from '../../constants';

// ({ analysis: Object }: Object) => Boolean
export default eqAnalysisStatus(ANALYSIS_STATUSES.COMPLETED);
