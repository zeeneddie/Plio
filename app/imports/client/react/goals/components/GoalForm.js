import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { noop } from 'plio-util';

import {
  FormField,
  InputField,
  TextareaField,
  DatePickerField,
  Magnitudes,
  SelectField,
  ColorPickerField,
} from '../../components';
import { UserSelectInput } from '../../forms/components';
import { StringLimits } from '../../../../share/constants';

export const GoalForm = ({
  organizationId,
  sequentialId,
  isEditMode,
  save = noop,
}) => (
  <Fragment>
    <FormField>
      Key goal name
      <InputField
        name="title"
        placeholder="Key goal name"
        onBlur={save}
        addon={sequentialId}
        maxLength={StringLimits.title.max}
        autoFocus
      />
    </FormField>
    <FormField>
      Description
      <TextareaField
        name="description"
        placeholder="Description"
        maxLength={StringLimits.description.max}
        onBlur={save}
      />
    </FormField>
    <FormField>
      Owner
      <UserSelectInput
        name="owner"
        placeholder="Owner"
        onChange={save}
        {...{ organizationId }}
      />
    </FormField>
    <FormField>
      Start date
      <DatePickerField
        name="startDate"
        onChange={save}
        placeholderText="Start date"
      />
    </FormField>
    <FormField>
      End date
      <DatePickerField
        name="endDate"
        onChange={save}
        placeholderText="End date"
      />
    </FormField>
    <FormField>
      Priority
      <Magnitudes.Select
        name="priority"
        onChange={save}
        component={SelectField}
      />
    </FormField>
    <FormField>
      Color
      <ColorPickerField
        name="color"
        id={isEditMode ? 'goal' : 'newGoal'}
        onChange={save}
      />
    </FormField>
  </Fragment>
);

GoalForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  sequentialId: PropTypes.string,
  isEditMode: PropTypes.bool,
  save: PropTypes.func,
};

export default React.memo(GoalForm);
