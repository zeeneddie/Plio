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

const KeyActivityForm = ({ organizationId }) => (
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
      Notes
      <TextareaField name="notes" placeholder="Notes" />
    </FormField>
  </CardBlock>
);

KeyActivityForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default KeyActivityForm;
