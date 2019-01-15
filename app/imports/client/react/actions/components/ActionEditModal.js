import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import isVerification from '../../forms/decorators/isVerification';
import { validateAction } from '../../../validation';
import {
  EntityModalNext,
  EntityModalHeader,
  EntityModalBody,
  EntityModalForm,
} from '../../components';
import ActionEditForm from './ActionEditForm';

const ActionEditModal = ({
  isOpen,
  toggle,
  loading,
  initialValues,
  onDelete,
  onSubmit,
  error,
  organizationId,
  linkedTo,
  canCompleteAnyAction,
  userId,
  action = {},
}) => (
  <EntityModalNext
    {...{
      isOpen,
      toggle,
      loading,
      error,
      onDelete,
    }}
    isEditMode
  >
    <EntityModalForm
      {...{ initialValues, onSubmit }}
      decorators={[isVerification]}
      validate={validateAction}
    >
      {({ handleSubmit }) => (
        <Fragment>
          <EntityModalHeader label="Action" />
          <EntityModalBody>
            <ActionEditForm
              {...{
                ...action,
                userId,
                linkedTo,
                organizationId,
                canCompleteAnyAction,
              }}
              save={handleSubmit}
            />
          </EntityModalBody>
        </Fragment>
      )}
    </EntityModalForm>
  </EntityModalNext>
);

ActionEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
  onDelete: PropTypes.func,
  action: PropTypes.object,
  linkedTo: PropTypes.object,
  canCompleteAnyAction: PropTypes.bool,
  userId: PropTypes.string,
};

export default ActionEditModal;
