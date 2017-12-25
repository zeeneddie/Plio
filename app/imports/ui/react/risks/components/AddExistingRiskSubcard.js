import React from 'react';
import PropTypes from 'prop-types';
import { CardBody } from 'reactstrap';
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
  <CardBody className="card-block">
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
  </CardBody>
));

AddExistingRiskSubcard.propTypes = {
  risks: PropTypes.arrayOf(PropTypes.object).isRequired,
  selected: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default AddExistingRiskSubcard;
