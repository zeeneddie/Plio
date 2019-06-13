import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { pure } from 'recompose';

import {
  Status,
  FormField,
  TextareaField,
} from '../../components';
import { getStatusColor } from '../../../../api/goals/helpers';
import { GoalStatuses, StringLimits } from '../../../../share/constants';
import GoalForm from './GoalForm';
import GoalCompleteForm from './GoalCompleteForm';

export const GoalEditFrom = ({
  status,
  organizationId,
  sequentialId,
  save,
}) => (
  <Fragment>
    <GoalForm {...{ organizationId, sequentialId, save }} isEditMode />
    <FormField>
      Status
      <Status color={getStatusColor(status)}>
        {GoalStatuses[status]}
      </Status>
    </FormField>
    <FormField>
      Status comment
      <TextareaField
        name="statusComment"
        placeholder="Status comment"
        onBlur={save}
        maxLength={StringLimits.description.max}
      />
    </FormField>
    <GoalCompleteForm {...{ organizationId, save }} />
  </Fragment>
);

GoalEditFrom.propTypes = {
  status: PropTypes.number.isRequired,
  organizationId: PropTypes.string,
  sequentialId: PropTypes.string,
  save: PropTypes.func.isRequired,
};

export default pure(GoalEditFrom);
