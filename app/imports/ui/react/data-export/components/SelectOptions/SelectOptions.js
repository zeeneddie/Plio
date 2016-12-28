import { _ } from 'meteor/underscore';
import React, { PropTypes } from 'react';
import Button from 'reactstrap/lib/Button';
import CardBlock from 'reactstrap/lib/CardBlock';
import Form from '/imports/ui/react/forms/components/Form';
import Checkbox from '/imports/ui/react/forms/components/Checkbox';
import Icon from '/imports/ui/react/components/Icon';


const SelectOptions = ({ fields, onSubmit, downloadLink, processing }) => (
  <div className="relative">
    <Form onSubmit={onSubmit}>
      <CardBlock>
        {fields.map(({ name, label, isDefault }) =>
          <Checkbox checked={isDefault} name={name} text={label} key={`risk-export-${name}`} />
        )}
      </CardBlock>
      <CardBlock className="text-xs-center">
        <Button color="primary" disabled={processing}>
          {processing ? <Icon names="spinner spin" margin="right" /> : null}
          {downloadLink ? 'Export again' : 'Export'}
        </Button>
        {downloadLink && !processing ?
          <Button download tag="a" href={downloadLink} color="link">Download</Button>
          : null
        }
      </CardBlock>
    </Form>
  </div>
);

SelectOptions.propTypes = {
  fields: PropTypes.array,
  onSubmit: PropTypes.func,
  downloadLink: PropTypes.string,
  processing: PropTypes.bool,
};

export default SelectOptions;
