import React, { PropTypes } from 'react';
import { ListGroup } from 'reactstrap';

import { DocumentTypes } from '/imports/share/constants';
import Field from '../../fields/read/components/Field';
import CardBlockCollapse from '../CardBlockCollapse';

const ModalBulkImport = ({ documentType }) => (
  <div className="relative">
    <ListGroup className="list-group-flush">
      <Field tag="button">
        Add a first {documentType} document
      </Field>
      <CardBlockCollapse leftText="Setup a bulk insert from other organization">
        <Field tag="button">
          Hello World
        </Field>
      </CardBlockCollapse>
    </ListGroup>
  </div>
);

ModalBulkImport.propTypes = {
  documentType: PropTypes.oneOf(Object.values(DocumentTypes)).isRequired,
};

export default ModalBulkImport;
