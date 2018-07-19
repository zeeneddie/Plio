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

const CanvasForm = ({ organizationId, children }) => (
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
    {children}
    <FormField>
      Notes
      <TextareaField name="notes" placeholder="Notes" />
    </FormField>
  </CardBlock>
);

CanvasForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  children: PropTypes.node,
};

export default CanvasForm;
