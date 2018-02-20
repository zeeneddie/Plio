import React from 'react';
import PropTypes from 'prop-types';
import { shouldUpdate } from 'recompose';
import { equals } from 'ramda';

import {
  FormField,
  CardBlock,
  SelectInput,
} from '../../components';

const enhance = shouldUpdate((props, nextProps) => (
  props.selected !== nextProps.selected ||
  !equals(props.risks, nextProps.risks)
));

const RiskSubcardAddExisting = enhance(({ risks, onChange, selected }) => (
  <CardBlock>
    <FormField>
      Existing risk
      <SelectInput
        value={selected}
        options={risks}
        onChange={onChange}
        placeholder="Existing risk"
      />
    </FormField>
  </CardBlock>
));

RiskSubcardAddExisting.propTypes = {
  risks: PropTypes.arrayOf(PropTypes.object).isRequired,
  selected: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default RiskSubcardAddExisting;
