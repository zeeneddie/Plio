import React, { PropTypes } from 'react';

import { CUSTOMER_SEQUENTIAL_ID } from '../../../../constants';

const SequentialId = ({ serialNumber }) => (
  <span>{`${CUSTOMER_SEQUENTIAL_ID}${serialNumber}`}</span>
);

SequentialId.propTypes = {
  serialNumber: PropTypes.number.isRequired,
};

export default SequentialId;
