import PropTypes from 'prop-types';
import React from 'react';
import { noop } from 'plio-util';
import { pure } from 'recompose';

import { StringLimits } from '../../../../share/constants';
import {
  CardBlock,
  FormField,
  InputField,
  UserSelectInput,
  ColorPickerField,
  TextareaField,
} from '../../components';

const CanvasForm = ({ organizationId, children, save = noop }) => (
  <CardBlock>
    <FormField>
      Title
      <InputField
        name="title"
        placeholder="Title"
        maxLength={StringLimits.title.max}
        onBlur={e => save({ title: e.target.value })}
      />
    </FormField>
    <FormField>
      Originator
      <UserSelectInput
        {...{ organizationId }}
        name="originator"
        placeholder="Originator"
        onChange={originator => save({ originator })}
      />
    </FormField>
    <FormField>
      Color
      <ColorPickerField
        name="color"
        onChange={color => save({ color })}
      />
    </FormField>
    {children}
    <FormField>
      Notes
      <TextareaField
        name="notes"
        placeholder="Notes"
        onBlur={e => save({ notes: e.target.value })}
      />
    </FormField>
  </CardBlock>
);

CanvasForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  children: PropTypes.node,
  save: PropTypes.func,
};

export default pure(CanvasForm);
