import { allPass, complement } from 'ramda';

import isAnalysisCompleted from './isAnalysisCompleted';
import isUpdateOfStandardsCompleted from './isUpdateOfStandardsCompleted';
import isAnalysisOwner from './isAnalysisOwner';

/*
(
  {
    analysis: Object,
    updateOfStandards: Object,
    organizationId: String
  }: Object,
  userId: String,
) => Boolean
*/
export default allPass([
  isAnalysisCompleted,
  isAnalysisOwner,
  complement(isUpdateOfStandardsCompleted),
]);
