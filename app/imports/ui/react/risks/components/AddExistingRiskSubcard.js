import React, { PropTypes } from 'react';
import { CardBlock } from 'reactstrap';

import {
  FormField,
  SelectInput,
} from '../../components';

const AddExistingRiskSubcard = ({ risks, onChange, selected }) => (
  <CardBlock>
    <FormField>
      Existing risk
      <SelectInput
        uncontrolled
        caret
        hint
        items={risks}
        input={{ placeholder: 'Existing risk' }}
        onSelect={onChange}
        {...{ selected }}
      />
    </FormField>
  </CardBlock>
);

AddExistingRiskSubcard.propTypes = {
  risks: PropTypes.arrayOf(PropTypes.object).isRequired,
  selected: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default AddExistingRiskSubcard;
