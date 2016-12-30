import React, { PropTypes } from 'react';
import Button from 'reactstrap/lib/Button';
import CardTitle from 'reactstrap/lib/CardTitle';
import CardBlock from 'reactstrap/lib/CardBlock';
import Icon from '/imports/ui/react/components/Icon';
import Form from '/imports/ui/react/forms/components/Form';

import Filter from '../Filter';
import SelectOptions from '../SelectOptions';

const DataExportModal = (props) => (
  <Form onSubmit={props.onSubmit}>
    <div className="relative">
      <CardBlock>
        <CardTitle>Export filter</CardTitle>
        <Filter {...props} />
      </CardBlock>
      <CardBlock>
        <CardTitle>Select export fields</CardTitle>
        <SelectOptions {...props} />
      </CardBlock>

      <CardBlock className="text-xs-center">
        <Button color="primary" disabled={props.processing}>
          {props.processing ? <Icon name="spinner spin" margin="right" /> : null}
          {props.downloadLink ? 'Export again' : 'Export'}
        </Button>
        {props.downloadLink && !props.processing ?
          <Button download tag="a" href={props.downloadLink} color="link">Download</Button>
          : null
        }
      </CardBlock>
    </div>
  </Form>
);

DataExportModal.propTypes = {
  downloadLink: PropTypes.string,
  processing: PropTypes.bool,
  onSubmit: PropTypes.func,
};

export default DataExportModal;
