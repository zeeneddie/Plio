import PropTypes from 'prop-types';
import React from 'react';
import { Button, CardBody } from 'reactstrap';
import IconLoading from '/imports/client/react/components/Icons/IconLoading';
import CardDivider from '/imports/client/react/components/CardDivider';
import Form from '/imports/client/react/forms/components/Form';
import CardBlockCollapse from '/imports/client/react/components/CardBlockCollapse';

import Filter from '../Filter';
import SelectOptions from '../SelectOptions';

const DataExportModal = props => (
  <Form onSubmit={props.onSubmit}>
    <div className="relative">
      <CardBody className="card-block">
        <SelectOptions {...props} />
      </CardBody>
      <CardDivider />
      <CardBlockCollapse leftText="Advanced filters" loading={props.processing}>
        <CardBody className="card-block">
          <Filter {...props} />
        </CardBody>
      </CardBlockCollapse>

      <CardBody className="text-xs-center card-block">
        <Button color="primary" disabled={props.processing}>
          {props.processing ? ([
            <IconLoading key="download-snippet" margin="right" />,
            'Exporting...',
          ]) : (
            'Download CSV file'
          )}
        </Button>
      </CardBody>
    </div>
  </Form>
);

DataExportModal.propTypes = {
  processing: PropTypes.bool,
  onSubmit: PropTypes.func,
};

export default DataExportModal;
