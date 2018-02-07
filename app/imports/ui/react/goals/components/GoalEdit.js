import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Input } from 'reactstrap';
import DebounceInput from 'react-debounce-input';

import GoalForm from './GoalForm';
import { Status, FormField } from '../../components';
import { getStatusColor } from '../../../../api/goals/helpers';
import { GoalStatuses } from '../../../../share/constants';
import { DEFAULT_UPDATE_TIMEOUT } from '../../../../api/constants';

const GoalEdit = (props) => {
  const {
    status,
    statusComment,
    onChangeStatusComment,
  } = props;

  return (
    <Fragment>
      <GoalForm isEditMode {...props} />
      <FormField>
        Status
        <Status color={getStatusColor(status)}>
          {GoalStatuses[status]}
        </Status>
      </FormField>
      <FormField>
        Status comment
        <DebounceInput
          element={Input}
          type="textarea"
          placeholder="Status comment"
          value={statusComment}
          onChange={onChangeStatusComment}
          debounceTimeout={DEFAULT_UPDATE_TIMEOUT}
        />
      </FormField>
    </Fragment>
  );
};

GoalEdit.propTypes = {
  status: PropTypes.number.isRequired,
  statusComment: PropTypes.string,
  onChangeStatusComment: PropTypes.func.isRequired,
};

export default GoalEdit;
