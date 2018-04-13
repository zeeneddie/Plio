import PropTypes from 'prop-types';
import React from 'react';

import { TimelineColors } from '../../../../api/constants';
import { MilestoneStatuses } from '../../../../share/constants';
import { Diamond } from '../../components';

const MilestoneSymbol = ({ status, color, ...props }) => {
  switch (status) {
    case MilestoneStatuses.AWAITING_COMPLETION:
      return <Diamond fill={TimelineColors.IN_PROGRESS} {...props} />;
    case MilestoneStatuses.OVERDUE:
      return <Diamond fill={TimelineColors.OVERDUE} {...props} />;
    case MilestoneStatuses.COMPLETE:
      return <Diamond fill={color} {...props} />;
    default:
      return null;
  }
};

MilestoneSymbol.propTypes = {
  status: PropTypes.number,
  size: PropTypes.number,
  color: PropTypes.string,
};

export default MilestoneSymbol;
