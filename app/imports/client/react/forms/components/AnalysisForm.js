import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Field, FormSpy } from 'react-final-form';
import { FormGroup, Button } from 'reactstrap';
import { pure } from 'recompose';

import { AnalysisStatuses } from '../../../../share/constants';
import { getAnalysisStatusClass } from '../../../../api/problems/helpers';
import FormField from './FormField';
import DatePickerField from './DatePickerField';
import Status from '../../fields/components/Status';
import { UserSelectInput } from '../../forms/components';
import ToggleComplete from '../../components/ToggleComplete';
import TextareaField from './TextareaField';
import StyledFlexFormGroup from '../../components/styled/StyledFlexFormGroup';
import FieldCondition from './FieldCondition';

const AnalysisForm = ({
  organizationId,
  userId,
  save,
  prefix,
}) => {
  const comments = (
    <Field name={`${prefix}.isCompleted`} subscription={{ value: true }}>
      {({ input: { value: isCompleted } }) => (
        <TextareaField
          name={`${prefix}.completionComments`}
          placeholder="Enter any completion comments"
          onBlur={e => isCompleted && save(e)}
        />
      )}
    </Field>
  );
  const executor = (
    <UserSelectInput
      name={`${prefix}.executor`}
      placeholder="Who will do it?"
      onChange={save}
      {...{ organizationId }}
    />
  );
  const completedBy = (
    <UserSelectInput
      name={`${prefix}.completedBy`}
      placeholder="Completed by"
      onChange={save}
      {...{ organizationId }}
    />
  );

  return (
    <Fragment>
      <FormField>
        Target date
        <Field name={`${prefix}.isCompleted`} subscription={{ value: true }}>
          {({ input: { value: isCompleted } }) => (
            <DatePickerField
              name={`${prefix}.targetDate`}
              onChange={save}
              placeholderText="Target date"
              disabled={!!isCompleted}
            />
          )}
        </Field>
      </FormField>
      <FieldCondition
        when={`${prefix}.isCompleted`}
        is={Boolean}
        otherwise={(
          <FormField>
            Who will do it?
            <FieldCondition
              when={`${prefix}.executor`}
              is={({ value }) => value && value === userId}
              otherwise={executor}
            >
              <ToggleComplete input={executor}>
                <FormGroup className="margin-top">
                  {comments}
                </FormGroup>
                <FormSpy subscription={{}}>
                  {({ form }) => (
                    <Button
                      color="success"
                      onClick={() => {
                        form.change(`${prefix}.isCompleted`, true);
                        form.submit();
                      }}
                    >
                      Complete
                    </Button>
                  )}
                </FormSpy>
              </ToggleComplete>
            </FieldCondition>
          </FormField>
        )}
      >
        <FormField>
          Completed date
          <DatePickerField
            name={`${prefix}.completedAt`}
            onChange={save}
            placeholderText="Completed date"
          />
        </FormField>
      </FieldCondition>
      <FormField>
        Status
        <Field name={`${prefix}.status`} subscription={{ value: true }}>
          {({ input: { value: status } }) => (
            <Status color={getAnalysisStatusClass(status)}>
              {AnalysisStatuses[status]}
            </Status>
          )}
        </Field>
      </FormField>
      <FieldCondition when={`${prefix}.isCompleted`} is={Boolean}>
        <FormField>
          Completed by
          <FieldCondition
            when={`${prefix}.completedBy`}
            is={({ value }) => value && value === userId}
            otherwise={completedBy}
          >
            <StyledFlexFormGroup>
              {completedBy}
              <FormSpy subscription={{}}>
                {({ form }) => (
                  <Button
                    color="link"
                    onClick={() => {
                      form.change(`${prefix}.isCompleted`, false);
                      form.submit();
                    }}
                  >
                    Undo
                  </Button>
                )}
              </FormSpy>
            </StyledFlexFormGroup>
          </FieldCondition>
        </FormField>
        <FormField>
          Comments
          {comments}
        </FormField>
      </FieldCondition>
    </Fragment>
  );
};

AnalysisForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  userId: PropTypes.string,
  onUndoCompletion: PropTypes.func,
  onComplete: PropTypes.func,
  save: PropTypes.func,
  prefix: PropTypes.string.isRequired,
};

export default pure(AnalysisForm);
