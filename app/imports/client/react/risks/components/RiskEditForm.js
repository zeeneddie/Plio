import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import { ProblemsStatuses } from '../../../../share/constants';
import { getClassByStatus } from '../../../../api/problems/helpers';
import RiskForm from './RiskForm';
import {
  FormField,
  Status,
  TextareaField,
  CardBlock,
  AnalysisForm,
} from '../../components';
import { StandardSelectInput, DepartmentSelectInput } from '../../forms/components';

const RiskEditForm = ({
  status,
  sequentialId,
  organizationId,
  guidelines,
  analysis = {},
  user = {},
  onChangeStatusComment,
  onChangeStandards,
  onChangeDepartments,
  onAddDepartment,
  onChangeTargetDate,
  onChangeExecutor,
  onChangeCompletionComments,
  onChangeCompletedAt,
  onChangeCompletedBy,
  onComplete,
  onUndoCompletion,
  onChangeTitle,
  onChangeDescription,
  onChangeOriginator,
  onChangeOwner,
  onChangeMagnitude,
  onChangeType,
}) => (
  <Fragment>
    <RiskForm
      {...{
        onChangeTitle,
        onChangeDescription,
        onChangeOriginator,
        onChangeOwner,
        onChangeMagnitude,
        onChangeType,
        organizationId,
        guidelines,
        sequentialId,
      }}
    >
      <FormField>
        Status
        <Status color={getClassByStatus(status)}>
          {ProblemsStatuses[status]}
        </Status>
      </FormField>
      <FormField>
        Status comment
        <TextareaField
          name="statusComment"
          placeholder="Status comment"
          onBlur={onChangeStatusComment}
        />
      </FormField>
      <FormField>
        Standard(s)
        <StandardSelectInput
          multi
          name="standards"
          placeholder="Standard(s)"
          onChange={onChangeStandards}
          organizationId={organizationId}
        />
      </FormField>
      <FormField>
        Department/sector(s)
        <DepartmentSelectInput
          name="departments"
          placeholder="Department/sector(s)"
          organizationId={organizationId}
          onChange={onChangeDepartments}
          onNewOptionClick={onAddDepartment}
        />
      </FormField>
    </RiskForm>
    <CardBlock>
      <FormField>
        Initial risk analysis
        {null}
      </FormField>
      <AnalysisForm
        status={analysis.status}
        userId={user._id}
        organizationId={organizationId}
        {...{
          onChangeTargetDate,
          onChangeCompletedAt,
          onChangeExecutor,
          onChangeCompletedBy,
          onChangeCompletionComments,
          onComplete,
          onUndoCompletion,
        }}
      />
    </CardBlock>
  </Fragment>
);

RiskEditForm.propTypes = {
  status: PropTypes.number,
  sequentialId: PropTypes.string,
  analysis: PropTypes.shape({
    status: PropTypes.number,
  }),
  organizationId: PropTypes.string.isRequired,
  user: PropTypes.object,
  onChangeStatusComment: PropTypes.func,
  onChangeStandards: PropTypes.func,
  onChangeDepartments: PropTypes.func,
  onAddDepartment: PropTypes.func,
  onChangeTargetDate: PropTypes.func,
  onChangeExecutor: PropTypes.func,
  onChangeCompletionComments: PropTypes.func,
  onChangeCompletedAt: PropTypes.func,
  onChangeCompletedBy: PropTypes.func,
  onComplete: PropTypes.func,
  onUndoCompletion: PropTypes.func,
  ...RiskForm.propTypes,
};

export default RiskEditForm;
