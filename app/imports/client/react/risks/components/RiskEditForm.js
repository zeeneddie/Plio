import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Field } from 'react-final-form';

import { ProblemsStatuses } from '../../../../share/constants';
import { getClassByStatus } from '../../../../api/problems/helpers';
import RiskForm from './RiskForm';
import {
  FormField,
  Status,
  TextareaField,
  CardBlock,
  AnalysisForm,
  CategorizeField,
} from '../../components';
import { StandardSelectInput } from '../../forms/components';

const RiskEditForm = ({
  sequentialId,
  organizationId,
  guidelines,
  userId,
  save,
}) => (
  <Fragment>
    <RiskForm
      isEdit
      {...{
        organizationId,
        guidelines,
        sequentialId,
        save,
      }}
    >
      <FormField>
        Status
        <Field name="status" subscription={{ value: true }}>
          {({ input: { value: status } }) => (
            <Status color={getClassByStatus(status)}>
              {ProblemsStatuses[status]}
            </Status>
          )}
        </Field>
      </FormField>
      <FormField>
        Status comment
        <TextareaField
          name="statusComment"
          placeholder="Status comment"
          onBlur={save}
        />
      </FormField>
      <FormField>
        Standard(s)
        <StandardSelectInput
          {...{ organizationId }}
          multi
          name="standards"
          placeholder="Standard(s)"
          onChange={save}
        />
      </FormField>
      <FormField>
        Categorize
        <CategorizeField
          name="categorize"
          placeholder="Add category"
          onChange={save}
          {...{ organizationId }}
        />
      </FormField>
    </RiskForm>
    <CardBlock>
      <FormField>
        Initial risk analysis
        {null}
      </FormField>
      <AnalysisForm
        {...{ save, organizationId, userId }}
        prefix="analysis"
      />
    </CardBlock>
  </Fragment>
);

RiskEditForm.propTypes = {
  sequentialId: PropTypes.string,
  organizationId: PropTypes.string.isRequired,
  userId: PropTypes.string,
  save: PropTypes.func,
  guidelines: PropTypes.object,
};

export default RiskEditForm;
