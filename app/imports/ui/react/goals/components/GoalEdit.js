import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import GoalForm from './GoalForm';
import { Status, FormField } from '../../components';
import { getStatusColor } from '../../../../api/goals/helpers';
import { GoalStatuses } from '../../../../share/constants';

const GoalEdit = (props) => {
  const { status } = props;

  return (
    <Fragment>
      <GoalForm isEditMode {...props} />
      <FormField>
        Status
        <Status color={getStatusColor(status)}>
          {GoalStatuses[status]}
        </Status>
      </FormField>
    </Fragment>
  );
};

GoalEdit.propTypes = {
  status: PropTypes.number.isRequired,
};

export default GoalEdit;
