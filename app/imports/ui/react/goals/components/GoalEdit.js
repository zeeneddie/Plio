import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Input, FormGroup } from 'reactstrap';
import DebounceInput from 'react-debounce-input';
import styled from 'styled-components';

import GoalForm from './GoalForm';
import { Status, FormField } from '../../components';
import { getStatusColor } from '../../../../api/goals/helpers';
import { GoalStatuses } from '../../../../share/constants';
import { DEFAULT_UPDATE_TIMEOUT } from '../../../../api/constants';
import { withToggle } from '../../helpers';
import ToggleComplete from '../../components/ToggleComplete';

const StyledToggleComplete = styled(ToggleComplete)`
  text-align: center;
  & > .form-group {
    text-align: center;
  }
`;
const UncontrolledStyledToggleComplete = withToggle()(props => <StyledToggleComplete {...props} />);

const GoalEdit = (props) => {
  const {
    status,
    statusComment,
    onChangeStatusComment,
    onComplete,
    completionComment,
    onChangeCompletionComment,
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
      <UncontrolledStyledToggleComplete
        completeButtonContent="Mark as complete"
        {...{ onComplete }}
      >
        <FormGroup className="margin-top">
          <DebounceInput
            element={Input}
            type="textarea"
            placeholder="Enter any completion comments"
            value={completionComment}
            onChange={onChangeCompletionComment}
            debounceTimeout={DEFAULT_UPDATE_TIMEOUT}
            rows={3}
          />
        </FormGroup>
      </UncontrolledStyledToggleComplete>
    </Fragment>
  );
};

GoalEdit.propTypes = {
  status: PropTypes.number.isRequired,
  statusComment: PropTypes.string,
  onChangeStatusComment: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  completionComment: PropTypes.string,
  onChangeCompletionComment: PropTypes.func.isRequired,
};

export default GoalEdit;
