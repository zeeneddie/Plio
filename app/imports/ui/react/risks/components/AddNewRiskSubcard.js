import React, { PropTypes } from 'react';
import { CardBlock } from 'reactstrap';

import { FormInput, FormField, SelectInput, Select, MagnitudeSelect } from '../../components';

const AddNewRiskSubcard = ({
  title,
  description,
  originatorId,
  ownerId,
  magnitude,
  onChangeTitle,
  onChangeDescription,
  onChangeOriginatorId,
  onChangeOwnerId,
  onChangeMagnitude,
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
      Description
      <FormInput
        element="textarea"
        onChange={onChangeDescription}
        value={description}
        placeholder="Description"
      />
    </FormField>
    <FormField>
      Originator
      <SelectInput
        uncontrolled
        caret
        hint
        input={{ placeholder: 'Originator' }}
        selected={originatorId}
        items={users}
        onSelect={onChangeOriginatorId}
      />
    </FormField>
    <FormField>
      Owner
      <SelectInput
        uncontrolled
        caret
        hint
        input={{ placeholder: 'Owner' }}
        selected={ownerId}
        items={users}
        onSelect={onChangeOwnerId}
      />
    </FormField>
    <FormField>
      Magnitude
      <MagnitudeSelect
        selectFirstAsDefault
        value={magnitude}
        onChange={onChangeMagnitude}
      />
    </FormField>
  </CardBlock>
);

AddNewRiskSubcard.propTypes = {
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  originatorId: PropTypes.string.isRequired,
  ownerId: PropTypes.string.isRequired,
  magnitude: PropTypes.string,
  onChangeTitle: PropTypes.func.isRequired,
  onChangeDescription: PropTypes.func.isRequired,
  onChangeOriginatorId: PropTypes.func.isRequired,
  onChangeOwnerId: PropTypes.func.isRequired,
  onChangeMagnitude: PropTypes.func.isRequired,
};

export default AddNewRiskSubcard;
