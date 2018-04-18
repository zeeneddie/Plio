import { allPass, complement, flip } from 'ramda';
import { eqAnalysisExecutor } from 'plio-util';

import isAnalysisCompleted from './isAnalysisCompleted';

// ({ analysis: Object }: Object, userId: String) => Boolean
export default allPass([
  complement(isAnalysisCompleted),
  flip(eqAnalysisExecutor),
]);
