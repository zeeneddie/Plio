import React, { PropTypes } from 'react';
import { ListGroup } from 'reactstrap';

import { DocumentTypes } from '/imports/share/constants';
import Field from '../../../fields/read/components/Field';
import CardBlockCollapse from '../../../components/CardBlockCollapse';
import OrganizationList from '../OrganizationList';

const ModalDataImport = ({
  documentType,
  label,
  onOrgClick,
  List = OrganizationList,
  ...other
}) => (
  <div className="relative">
    <ListGroup className="list-group-flush">
      <Field tag="button">
        {label || `Add a first ${documentType} document`}
      </Field>
      <CardBlockCollapse leftText="Setup a bulk insert from other organization" {...other}>
        <List {...{ documentType, onOrgClick, ...other }} />
      </CardBlockCollapse>
    </ListGroup>
  </div>
);

ModalDataImport.propTypes = {
  documentType: PropTypes.oneOf(Object.values(DocumentTypes)).isRequired,
  label: PropTypes.string,
  List: PropTypes.func,
  onOrgClick: PropTypes.func,
};

export default ModalDataImport;
