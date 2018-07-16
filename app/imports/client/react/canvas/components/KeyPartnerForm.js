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
} from '../../components';
import CriticalityField from './CriticalityField';

const KeyPartnerForm = ({ organizationId }) => (
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
        placeholder="Created by"
      />
    </FormField>
    <FormField>
      Color
      <ColorPickerField name="color" />
    </FormField>
    <FormField>
      Criticality
      <CriticalityField name="criticality" />
    </FormField>
    <FormField>
      Level of spend
      <CriticalityField name="levelOfSpend" />
    </FormField>
    <FormField>
      Notes
      <TextareaField name="notes" placeholder="Notes" />
    </FormField>
  </CardBlock>
);

KeyPartnerForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default KeyPartnerForm;
