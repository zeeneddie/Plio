import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { mapEntitiesToOptions } from 'plio-util';

import { getClassByStatus, getStatusName } from '../../../../api/actions/helpers';
import ActionForm from './ActionForm';
import ActionVerificationForm from './ActionVerificationForm';
import { FormField, Status, ApolloSelectInputField } from '../../components';

const ActionEditForm = ({
  status,
  save,
  loadLinkedDocs,
  ...props
}) => (
  <Fragment>
    <ActionForm {...{ save, ...props }}>
      <FormField>
        Linked to
        <ApolloSelectInputField
          multi
          name="linkedTo"
          placeholder="Linked to"
          loadOptions={loadLinkedDocs}
          transformOptions={mapEntitiesToOptions}
          onChange={save}
        />
      </FormField>
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
  loadLinkedDocs: PropTypes.func.isRequired,
  status: PropTypes.number,
  save: PropTypes.func,
};

export default ActionEditForm;
