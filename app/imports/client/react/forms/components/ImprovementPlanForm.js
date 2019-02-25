import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { StringLimits } from '../../../../share/constants';
import {
  FormField,
  TextareaField,
  DatePickerField,
  UserSelectInput,
} from '../../components';

const ImprovementPlanForm = ({ save, organizationId }) => (
  <Fragment>
    <FormField sm={7}>
      Statement of desired outcome
      <TextareaField
        name="desiredOutcome"
        onBlur={save}
        placeholder="Statement of desired outcome"
        maxLength={StringLimits.description.max}
      />
    </FormField>
    <FormField sm={7}>
      Target date for desired outcome
      <DatePickerField
        isClearable
        placeholderDate={new Date()}
        name="targetDate"
        onChange={save}
      />
    </FormField>
    {/* TODO add Improvement plan review dates */}
    <FormField sm={7}>
      Owner
      <UserSelectInput
        name="owner"
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
  save: PropTypes.func,
};

export default ImprovementPlanForm;
