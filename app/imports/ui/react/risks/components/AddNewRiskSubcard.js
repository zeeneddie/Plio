import React, { PropTypes } from 'react';
import { CardBlock } from 'reactstrap';
import { withState } from 'recompose';

import { FormInput, FormField, SelectInput } from '../../components';

const SelectInputEnhanced = withState('value', 'setValue', '')(SelectInput);

const AddNewRiskSubcard = ({
  title,
  originatorId,
  onChangeTitle,
  onChangeOriginatorId,
  users,
}) => (
  <CardBlock>
    <FormField>
      Risk name
      <FormInput
        onChange={onChangeTitle}
        value={title}
        placeholder="Risk name"
      />
    </FormField>
    <FormField>
      Originator
      <SelectInputEnhanced
        caret
        hint
        input={{ placeholder: 'Originator' }}
        selected={originatorId}
        items={users}
        onSelect={onChangeOriginatorId}
      />
    </FormField>
  </CardBlock>
);

AddNewRiskSubcard.propTypes = {
  title: PropTypes.string.isRequired,
  originatorId: PropTypes.string.isRequired,
  onChangeTitle: PropTypes.func.isRequired,
  onChangeOriginatorId: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default AddNewRiskSubcard;
