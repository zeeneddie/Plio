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

const CanvasForm = ({ organizationId, children, save }) => (
  <CardBlock>
    <FormField>
      Title
      <InputField
        name="title"
        placeholder="Title"
        maxLength={StringLimits.title.max}
        onBlur={save}
        autoFocus
      />
    </FormField>
    <FormField>
      Originator
      <UserSelectInput
        {...{ organizationId }}
        name="originator"
        placeholder="Originator"
        onChange={save}
        maxLength={StringLimits.description.max}
      />
    </FormField>
    <FormField>
      Color
      <ColorPickerField
        name="color"
        id="canvas"
        onChange={save}
      />
    </FormField>
    {children}
    <FormField>
      Notes
      <TextareaField
        name="notes"
        placeholder="Notes"
        onBlur={save}
        maxLength={StringLimits.description.max}
      />
    </FormField>
  </CardBlock>
);

CanvasForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  children: PropTypes.node,
  save: PropTypes.func,
};

export default React.memo(CanvasForm);
