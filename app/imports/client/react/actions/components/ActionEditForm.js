import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import { getClassByStatus, getStatusName } from '../../../../api/actions/helpers';
import ActionForm from './ActionForm';
import ActionVerificationForm from './ActionVerificationForm';
import { FormField, Status, LinkedEntityInput } from '../../components';

const ActionEditForm = ({
  status,
  save,
  linkedTo: {
    title: value,
    sequentialId,
  } = {},
  ...props
}) => (
  <Fragment>
    <ActionForm {...{ save, ...props }}>
      {value && (
        <FormField>
          Linked to
          <LinkedEntityInput disabled {...{ sequentialId, value }} />
        </FormField>
      )}
      <FormField>
        Status
        <Status color={getClassByStatus(status)}>
          {getStatusName(status)}
        </Status>
      </FormField>
    </ActionForm>
    <ActionVerificationForm {...{ save, ...props }} />
  </Fragment>
);

ActionEditForm.propTypes = {
  status: PropTypes.number,
  save: PropTypes.func,
  linkedTo: PropTypes.object,
};

export default ActionEditForm;
