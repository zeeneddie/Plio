import React, { PropTypes } from 'react';
import CardBlock from 'reactstrap/lib/CardBlock';
import Form from '/imports/ui/react/forms/components/Form';
import Checkbox from '/imports/ui/react/forms/components/Checkbox';

const SelectOptions = ({ fields }) => (
  <div className="relative">
    <Form.SubForm name="fields">
      <CardBlock>
        {fields.map(({ name, label, isDefault }) =>
          <Checkbox checked={isDefault} name={name} text={label} key={`risk-export-${name}`} />
        )}
      </CardBlock>
    </Form.SubForm>
  </div>
);

SelectOptions.propTypes = {
  fields: PropTypes.array,
};

export default SelectOptions;
