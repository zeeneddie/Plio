import PropTypes from 'prop-types';
import React from 'react';

import OrgName from '../../fields/edit/components/OrgName';
import CustomerTypeSelectContainer from '../../fields/edit/containers/CustomerTypeSelectContainer';
import OrgDeleteContainer from '../../fields/edit/containers/OrgDeleteContainer';

const ModalEdit = ({ organization = {} }) => (
  <div className="relative">
    <div className="card-block">
      <OrgName {...organization} />
      <CustomerTypeSelectContainer {...organization} />
    </div>
    <OrgDeleteContainer {...organization} />
  </div>
);

ModalEdit.propTypes = {
  organization: PropTypes.object.isRequired,
};

export default ModalEdit;
