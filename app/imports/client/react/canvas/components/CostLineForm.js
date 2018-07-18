import PropTypes from 'prop-types';
import React from 'react';

import { StringLimits } from '../../../../share/constants';
import {
  CardBlock,
  FormField,
  InputField,
  UserSelectInput,
  ColorPickerField,
  TextareaField,
  PercentInputField,
} from '../../components';

const CostLineForm = ({ organizationId }) => (
  <CardBlock>
    <FormField>
      Title
      <InputField
        name="title"
        placeholder="Title"
        maxLength={StringLimits.title.max}
      />
    </FormField>
    <FormField>
      Originator
      <UserSelectInput
        {...{ organizationId }}
        name="originator"
        placeholder="Originator"
      />
    </FormField>
    <FormField>
      Color
      <ColorPickerField name="color" />
    </FormField>
    <FormField>
      % of total cost
      <PercentInputField name="percentOfTotalCost" />
    </FormField>
    <FormField>
      Notes
      <TextareaField name="notes" placeholder="Notes" />
    </FormField>
  </CardBlock>
);

CostLineForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default CostLineForm;
