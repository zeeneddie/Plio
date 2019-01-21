import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

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
  canCompleteAnyAction,
  userId,
  loadLinkedDocs,
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
      validate={validateAction}
    >
      {({ handleSubmit }) => (
        <Fragment>
          <EntityModalHeader label="Action" />
          <EntityModalBody>
            <ActionEditForm
              {...{
                ...action,
                loadLinkedDocs,
                userId,
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
  loadLinkedDocs: PropTypes.func.isRequired,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
  onDelete: PropTypes.func,
  action: PropTypes.object,
  canCompleteAnyAction: PropTypes.bool,
  userId: PropTypes.string,
};

export default ActionEditModal;
