import React, { PropTypes } from 'react';
import { CardBlock } from 'reactstrap';

import {
  FormField,
  SelectMultiInput,
} from '../../components';

const AddExistingRiskSubcard = ({ standards, standardsIds, onChangeStandardsIds }) => (
  <CardBlock>
    <FormField>
      Standards
      <SelectMultiInput
        items={standards}
        input={{ placeholder: 'Link to standard(s)' }}
        onChange={onChangeStandardsIds}
        selected={standardsIds}
      />
    </FormField>
  </CardBlock>
);

AddExistingRiskSubcard.propTypes = {
  standards: PropTypes.arrayOf(PropTypes.object).isRequired,
  standardsIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChangeStandardsIds: PropTypes.func.isRequired,
};

export default AddExistingRiskSubcard;
