import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { StringLimits } from '../../../../share/constants';
import {
  FormField,
  TextareaField,
  DatePickerField,
  UserSelectInput,
} from '../../components';
import DateArrayField from './DateArrayField';

const ImprovementPlanForm = ({ save, name, organizationId }) => (
  <Fragment>
    <FormField sm={7}>
      Statement of desired outcome
      <TextareaField
        name={`${name}.desiredOutcome`}
        onBlur={save}
        placeholder="Statement of desired outcome"
        maxLength={StringLimits.description.max}
      />
    </FormField>
    <FormField sm={7}>
      Target date for desired outcome
      <DatePickerField
        isClearable
        name={`${name}.targetDate`}
        placeholderDate={new Date()}
        onChange={save}
      />
    </FormField>
    <FormField sm={7}>
      Improvement plan review dates
      <DateArrayField
        isClearable
        name={`${name}.reviewDates`}
        placeholderDate={new Date()}
        onChange={save}
      />
    </FormField>
    <FormField sm={7}>
      Owner
      <UserSelectInput
        name={`${name}.owner`}
        placeholder="Owner"
        onChange={save}
        {...{ organizationId }}
      />
    </FormField>
    {/* TODO add File field when https://github.com/Pliohub/Plio/pull/1892 branch will be merged */}
  </Fragment>
);

ImprovementPlanForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  save: PropTypes.func,
};

export default ImprovementPlanForm;
