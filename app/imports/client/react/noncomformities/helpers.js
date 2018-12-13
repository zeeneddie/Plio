import { StatusColors, ProblemStatusTypes } from '../../../api/constants';
import { getProblemStatusColor } from '../../../api/problems/helpers';

export const getStatusColor = (status) => {
  switch (getProblemStatusColor(status)) {
    case ProblemStatusTypes.AMBER:
      return StatusColors.AMBER;
    case ProblemStatusTypes.GREEN:
      return StatusColors.GREEN;
    case ProblemStatusTypes.RED:
      return StatusColors.RED;
    default:
      return StatusColors.DEFAULT;
  }
};
