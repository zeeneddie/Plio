import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';
import { Input } from 'reactstrap';
import { pickNonInt } from 'plio-util';

import { CustomerElementStatuses } from '../../../../share/constants';

const CustomerElementStatusField = ({ status, className, ...props }) => (
  <Input
    plaintext
    className={cx(
      'form-control-static',
      {
        'text-success': status === CustomerElementStatuses.MATCHED,
        'text-danger': status === CustomerElementStatuses.UNMATCHED,
      },
      className,
    )}
    {...props}
  >
    {CustomerElementStatuses[status]}
  </Input>
);

CustomerElementStatusField.propTypes = {
  status: PropTypes.oneOf(Object.values(pickNonInt(CustomerElementStatuses))).isRequired,
  className: PropTypes.string,
};

export default CustomerElementStatusField;
