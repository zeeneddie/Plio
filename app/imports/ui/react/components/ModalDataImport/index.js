import React, { PropTypes } from 'react';
import { ListGroup } from 'reactstrap';

import { DocumentTypes } from '/imports/share/constants';
import Field from '../../fields/read/components/Field';
import CardBlockCollapse from '../CardBlockCollapse';

const ModalDataImport = ({ documentType, ownOrganizations, ...other }) => (
  <div className="relative">
    <ListGroup className="list-group-flush">
      <Field tag="button">
        Add a first {documentType} document
      </Field>
      <CardBlockCollapse leftText="Setup a bulk insert from other organization" {...other}>
        {ownOrganizations.map(({ _id, name }) => (
          <Field tag="button" key={_id}>
            {name}
          </Field>
        ))}
      </CardBlockCollapse>
    </ListGroup>
  </div>
);

ModalDataImport.propTypes = {
  documentType: PropTypes.oneOf(Object.values(DocumentTypes)).isRequired,
};

export default ModalDataImport;
