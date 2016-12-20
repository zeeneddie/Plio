import React, { PropTypes } from 'react';
import Form from '/imports/ui/react/forms/components/Form';
import SelectInput from '/imports/ui/react/forms/components/SelectInput';

const TitleSelect = ({ label, ...other }) => (
  <Form.Group>
    <Form.Label colXs={12} colSm={4}>
      {label}
    </Form.Label>
    <SelectInput
      {...other}
      colXs={12}
      colSm={8}
    />
  </Form.Group>
);

TitleSelect.propTypes = {
  name: PropTypes.string,
  selected: PropTypes.string,
  label: PropTypes.string,
  items: PropTypes.array,
};

export default TitleSelect;
