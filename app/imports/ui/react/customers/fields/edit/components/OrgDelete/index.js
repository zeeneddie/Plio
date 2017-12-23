import PropTypes from 'prop-types';
import React from 'react';

import Button from '../../../../../components/Buttons/Button';

const OrgDelete = ({ onOrgDelete: onClick }) => (
  <div className="card-block text-xs-center">
    <Button color="danger" {...{ onClick }}>Delete organization</Button>
  </div>
);

OrgDelete.propTypes = {
  onOrgDelete: PropTypes.func.isRequired,
};

export default OrgDelete;
