import React, { PropTypes } from 'react';

import OrgName from '../../fields/edit/components/OrgName';
import CustomerTypeSelectContainer from '../../fields/edit/containers/CustomerTypeSelectContainer';
import OrgDelete from '../../fields/edit/containers/OrgDelete';

const ModalEdit = ({ organization = {} }) => (
  <div className="relative">
    <div className="card-block">
      <OrgName {...organization} />
      <CustomerTypeSelectContainer {...organization} />
    </div>
    <OrgDelete {...organization} />
  </div>
);

ModalEdit.propTypes = {
  organization: PropTypes.object.isRequired,
};

export default ModalEdit;
