import React, { PropTypes } from 'react';

import Button from '../../../../../components/Buttons/Button';

const OrgDelete = ({ onOrgDelete: onClick }) => (
  <div className="card-block text-xs-center">
    <Button type="danger" {...{ onClick }}>Delete organization</Button>
  </div>
);

OrgDelete.propTypes = {
  onOrgDelete: PropTypes.func.isRequired,
};

export default OrgDelete;
