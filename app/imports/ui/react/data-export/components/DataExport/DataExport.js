import React, { PropTypes } from 'react';
import { withState } from 'recompose';
import Button from 'reactstrap/lib/Button';
import CardTitle from 'reactstrap/lib/CardTitle';
import CardBlock from 'reactstrap/lib/CardBlock';
import Icon from '/imports/ui/react/components/Icon';
import CardDivider from '/imports/ui/react/components/CardDivider';
import Subcard from '/imports/ui/react/components/Subcard';
import Form from '/imports/ui/react/forms/components/Form';

import Filter from '../Filter';
import SelectOptions from '../SelectOptions';

const enhance = withState('isFilterCollapsed', 'setIsFilterCollapsed', true);
const DataExportModal = enhance((props) => {
  const exportLabel = props.processing && 'Exporting...' ||
    props.downloadLink && 'Export again' || 'Export';

  return (
    <Form onSubmit={props.onSubmit}>
      <div className="relative">
        <CardBlock>
          <SelectOptions {...props} />
        </CardBlock>
        <CardDivider />
        <Subcard
          collapsed={props.isFilterCollapsed}
          setCollapsed={props.setIsFilterCollapsed}
        >
          <Subcard.Title>
            <Subcard.TitleItem pull="left">
              Advanced filters
            </Subcard.TitleItem>
          </Subcard.Title>
          <Subcard.Content>
            <Filter {...props} />
          </Subcard.Content>
        </Subcard>

        <CardBlock className="text-xs-center">
          <Button color="primary" disabled={props.processing}>
            {props.processing ? <Icon name="spinner spin" margin="right" /> : null}
            {exportLabel}
          </Button>
          {props.downloadLink && !props.processing ?
            <Button download tag="a" href={props.downloadLink} color="link">Download</Button>
            : null
          }
        </CardBlock>
      </div>
    </Form>
  );
});

DataExportModal.propTypes = {
  downloadLink: PropTypes.string,
  processing: PropTypes.bool,
  onSubmit: PropTypes.func,
};

export default DataExportModal;