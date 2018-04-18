import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { FormSpy } from 'react-final-form';
import { FormGroup, Button } from 'reactstrap';
import { onlyUpdateForKeys } from 'recompose';

import { AnalysisStatuses, ANALYSIS_STATUSES } from '../../../../share/constants';
import { getAnalysisStatusClass } from '../../../../api/problems/helpers';
import FormField from './FormField';
import DatePickerField from './DatePickerField';
import Status from '../../fields/components/Status';
import OrgUsersSelectInputContainer from '../../containers/OrgUsersSelectInputContainer';
import SelectInputField from './SelectInputField';
import ToggleComplete from '../../components/ToggleComplete';
import TextareaField from './TextareaField';
import StyledFlexFormGroup from '../../components/styled/StyledFlexFormGroup';

const enhance = onlyUpdateForKeys(['organizationId', 'status', 'userId']);

const AnalysisForm = ({
  organizationId,
  status,
  userId,
  onChangeTargetDate,
  onChangeCompletedAt,
  onChangeExecutor,
  onChangeCompletedBy,
  onChangeCompletionComments,
  onComplete,
  onUndoCompletion,
}) => {
  const isCompleted = status === ANALYSIS_STATUSES.COMPLETED;
  const comments = (
    <TextareaField
      name="completionComments"
      placeholder="Enter any completion comments"
      onBlur={e => isCompleted && onChangeCompletionComments(e)}
    />
  );

  return (
    <Fragment>
      <FormField>
        Target date
        <DatePickerField
          name="targetDate"
          onChange={onChangeTargetDate}
          placeholderText="Target date"
          disabled={isCompleted}
        />
      </FormField>
      {isCompleted ? (
        <FormField>
          Completed date
          <DatePickerField
            name="completedAt"
            onChange={onChangeCompletedAt}
            placeholderText="Completed date"
          />
        </FormField>
      ) : (
        <FormField>
          Who will do it?
          <FormSpy subscription={{ values: true }}>
            {({ values: { executor: { value } = {}, completionComments } }) => {
              const component = (
                <OrgUsersSelectInputContainer
                  name="executor"
                  placeholder="Who will do it?"
                  component={SelectInputField}
                  onChange={onChangeExecutor}
                  {...{ organizationId }}
                />
              );

              if (!value || value !== userId) return component;

              return (
                <ToggleComplete input={component}>
                  <FormGroup className="margin-top">
                    {comments}
                  </FormGroup>
                  <Button
                    color="success"
                    onClick={() => onComplete({ completionComments })}
                  >
                    Complete
                  </Button>
                </ToggleComplete>
              );
            }}
          </FormSpy>
        </FormField>
      )}
      <FormField>
        Status
        <Status color={getAnalysisStatusClass(status)}>
          {AnalysisStatuses[status]}
        </Status>
      </FormField>
      {isCompleted && (
        <Fragment>
          <FormField>
            Completed by
            <FormSpy subscription={{ values: true }}>
              {({ values: { completedBy: { value } = {} } }) => {
                const component = (
                  <OrgUsersSelectInputContainer
                    name="completedBy"
                    placeholder="Completed by"
                    component={SelectInputField}
                    onChange={onChangeCompletedBy}
                    {...{ organizationId }}
                  />
                );

                if (!value || value !== userId) return component;

                return (
                  <StyledFlexFormGroup>
                    {component}
                    <Button color="link" onClick={onUndoCompletion}>
                      Undo
                    </Button>
                  </StyledFlexFormGroup>
                );
              }}
            </FormSpy>
          </FormField>
          <FormField>
            Comments
            {comments}
          </FormField>
        </Fragment>
      )}
    </Fragment>
  );
};

AnalysisForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  status: PropTypes.number,
  userId: PropTypes.string,
  onChangeTargetDate: PropTypes.func,
  onChangeCompletedAt: PropTypes.func,
  onChangeExecutor: PropTypes.func,
  onChangeCompletedBy: PropTypes.func,
  onChangeCompletionComments: PropTypes.func,
  onUndoCompletion: PropTypes.func,
  onComplete: PropTypes.func,
};

export default enhance(AnalysisForm);
