import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { renameKeys } from 'plio-util';

import { getClassByStatus, getStatusName } from '../../../../api/actions/helpers';
import { WorkflowTypes } from '../../../../share/constants';
import ActionForm from './ActionForm';
import ActionVerificationForm from './ActionVerificationForm';
import { FormField, Status, CardBlock, LinkedEntityInput } from '../../components';

const ActionEditForm = ({
  status,
  save,
  linkedTo,
  ...props
}) => (
  <Fragment>
    <ActionForm {...{ save, ...props }}>
      {linkedTo && (
        <FormField>
          Linked to
          <LinkedEntityInput disabled {...renameKeys({ title: 'value' }, linkedTo)} />
        </FormField>
      )}
      <FormField>
        Status
        <Status color={getClassByStatus(status)}>
          {getStatusName(status)}
        </Status>
      </FormField>
    </ActionForm>
    {props.isCompleted && props.workflowType === WorkflowTypes.SIX_STEP && (
      <CardBlock>
        <ActionVerificationForm {...{ save, ...props }} />
      </CardBlock>
    )}
  </Fragment>
);

ActionEditForm.propTypes = {
  status: PropTypes.number,
  isCompleted: PropTypes.bool,
  workflowType: PropTypes.oneOf(Object.values(WorkflowTypes)),
  save: PropTypes.func,
  linkedTo: PropTypes.object,
};

export default ActionEditForm;
