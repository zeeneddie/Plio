import React, { PropTypes } from 'react';
import { CardBlock } from 'reactstrap';
import { shouldUpdate } from 'recompose';

import {
  FormField,
  SelectInput,
} from '../../components';

const enhance = shouldUpdate((props, nextProps) => (
  props.risks.length !== nextProps.risks.length ||
  props.selected !== nextProps.selected
));

const AddExistingRiskSubcard = enhance(({ risks, onChange, selected }) => (
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
));

AddExistingRiskSubcard.propTypes = {
  risks: PropTypes.arrayOf(PropTypes.object).isRequired,
  selected: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default AddExistingRiskSubcard;
