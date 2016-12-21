import React, { PropTypes } from 'react';
import { withHandlers } from 'recompose';

import OrgName from '../../fields/edit/components/OrgName';
import CustomerTypeSelectContainer from '../../fields/edit/containers/CustomerTypeSelectContainer';
import Button from '../../../components/Buttons/Button';
import { handleOrgDelete } from './handlers';

const enhance = withHandlers({ onOrgDelete: handleOrgDelete });

const ModalEdit = enhance(({ organization = {}, onOrgDelete }) => (
  <div className="relative">
    <div className="card-block">
      <OrgName {...organization} />
      <CustomerTypeSelectContainer {...organization} />
    </div>
    <div className="card-block text-xs-center">
      <Button type="secondary" onClick={onOrgDelete}>Delete</Button>
    </div>
  </div>
));

ModalEdit.propTypes = {
  organization: PropTypes.object.isRequired,
};

export default ModalEdit;
