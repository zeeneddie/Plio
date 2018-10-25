import PropTypes from 'prop-types';
import React from 'react';

import { Diamond } from '../../components';
import { getMilestoneSymbolColor } from '../helpers';

const MilestoneSymbol = ({ status, color, ...props }) => {
  const fill = getMilestoneSymbolColor(status, color);

  return fill ? <Diamond {...{ ...props, fill }} /> : null;
};

MilestoneSymbol.propTypes = {
  status: PropTypes.number,
  size: PropTypes.number,
  color: PropTypes.string,
};

export default MilestoneSymbol;
