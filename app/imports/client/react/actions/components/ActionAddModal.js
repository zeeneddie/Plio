import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Form } from 'reactstrap';

import {
  EntityModalNext,
  EntityModalHeader,
  EntityModalBody,
  EntityModalForm,
} from '../../components';
import NewActionForm from './NewActionForm';

const ActionAddModal = ({
  isOpen,
  toggle,
  onSubmit,
  initialValues,
  organizationId,
  ...props
}) => (
  <EntityModalNext {...{ isOpen, toggle }}>
    <EntityModalForm
      {...{ initialValues, onSubmit }}
      keepDirtyOnReinitialize
    >
      {({ handleSubmit }) => (
        <Fragment>
          <EntityModalHeader label="Action" />
          <EntityModalBody>
            <Form onSubmit={handleSubmit}>
              {/* hidden input is needed for return key to work */}
              <input hidden type="submit" />
              <NewActionForm {...{ organizationId, ...props }} />
            </Form>
          </EntityModalBody>
        </Fragment>
      )}
    </EntityModalForm>
  </EntityModalNext>
);

ActionAddModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
};

export default ActionAddModal;
