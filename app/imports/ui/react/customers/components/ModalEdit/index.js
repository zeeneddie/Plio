import React, { PropTypes } from 'react';

import OrgName from '../../fields/edit/components/OrgName';
import CustomerTypeSelectContainer from '../../fields/edit/containers/CustomerTypeSelectContainer';
import OrgDeleteButtonContainer from '../../fields/edit/containers/OrgDeleteButtonContainer';

const ModalEdit = ({ organization = {} }) => (
  <div className="relative">
    <div className="card-block">
      <OrgName {...organization} />
      <CustomerTypeSelectContainer {...organization} />
    </div>
    <div className="card-block text-xs-center">
      <OrgDeleteButtonContainer {...organization} />
    </div>
  </div>
);

ModalEdit.propTypes = {
  organization: PropTypes.object.isRequired,
};

export default ModalEdit;
