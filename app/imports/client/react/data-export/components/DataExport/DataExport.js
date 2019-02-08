import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Button } from 'reactstrap';
import IconLoading from '/imports/client/react/components/Icons/IconLoading';
import CardDivider from '/imports/client/react/components/CardDivider';
import Form from '/imports/client/react/forms/components/Form';
import CardBlockCollapse from '/imports/client/react/components/CardBlockCollapse';

import Filter from '../Filter';
import SelectOptions from '../SelectOptions';
import { CardBlock } from '../../../components';

const DataExportModal = props => (
  <Fragment>
    <CardBlock>
      By default, only open items will be exported. To change this, go to Advanced Filters
    </CardBlock>
    <CardDivider />
    <Form onSubmit={props.onSubmit}>
      <div className="relative">
        <CardBlock className="card-block">
          <SelectOptions {...props} />
        </CardBlock>
        <CardDivider />
        <CardBlockCollapse leftText="Advanced filters" loading={props.processing}>
          <CardBlock className="card-block">
            <Filter {...props} />
          </CardBlock>
        </CardBlockCollapse>

        <CardBlock className="text-xs-center card-block">
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
  </Fragment>
);

DataExportModal.propTypes = {
  processing: PropTypes.bool,
  onSubmit: PropTypes.func,
};

export default DataExportModal;
