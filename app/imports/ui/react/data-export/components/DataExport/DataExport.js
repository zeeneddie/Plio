import PropTypes from 'prop-types';
import React from 'react';
import Button from 'reactstrap/lib/Button';
import CardBlock from 'reactstrap/lib/CardBlock';
import IconLoading from '/imports/ui/react/components/Icons/IconLoading';
import CardDivider from '/imports/ui/react/components/CardDivider';
import Form from '/imports/ui/react/forms/components/Form';
import CardBlockCollapse from '/imports/ui/react/components/CardBlockCollapse';

import Filter from '../Filter';
import SelectOptions from '../SelectOptions';

const DataExportModal = props => (
  <Form onSubmit={props.onSubmit}>
    <div className="relative">
      <CardBlock>
        <SelectOptions {...props} />
      </CardBlock>
      <CardDivider />
      <CardBlockCollapse leftText="Advanced filters" loading={props.processing}>
        <CardBlock>
          <Filter {...props} />
        </CardBlock>
      </CardBlockCollapse>

      <CardBlock className="text-xs-center">
        <Button color="primary" disabled={props.processing}>
          {props.processing ? ([
            <IconLoading key="download-snippet" margin="right" />,
            'Exporting...',
          ]) : (
            'Download CSV file'
          )}
        </Button>
      </CardBlock>
    </div>
  </Form>
);

DataExportModal.propTypes = {
  processing: PropTypes.bool,
  onSubmit: PropTypes.func,
};

export default DataExportModal;
