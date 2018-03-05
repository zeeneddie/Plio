import PropTypes from 'prop-types';
import React from 'react';

import { MilestoneStatuses } from '../../../../share/constants';
import { Rect, Diamond } from '../../components';

const MilestoneSymbol = ({ status, color }) => {
  switch (status) {
    case MilestoneStatuses.AWAITING_COMPLETION:
      return <Diamond fill="white" stroke={color} />;
    case MilestoneStatuses.OVERDUE:
      return <Rect fill="red" />;
    case MilestoneStatuses.COMPLETE:
      return <Rect fill={color} />;
    default:
      return null;
  }
};

MilestoneSymbol.propTypes = {
  status: PropTypes.number,
  color: PropTypes.string,
};

export default MilestoneSymbol;
