import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Form } from 'reactstrap';

import {
  EntityModalNext,
  EntityModalHeader,
  EntityModalBody,
  EntityModalForm,
} from '../../components';
import MilestoneForm from './MilestoneForm';

export const MilestoneAddModal = ({
  isOpen,
  toggle,
  onSubmit,
  organizationId,
  initialValues,
}) => (
  <EntityModalNext {...{ isOpen, toggle }}>
    <EntityModalForm
      {...{ initialValues, onSubmit }}
      keepDirtyOnReinitialize
    >
      {({ handleSubmit }) => (
        <Fragment>
          <EntityModalHeader label="Milestone" />
          <EntityModalBody>
            <Form onSubmit={handleSubmit}>
              {/* hidden input is needed for return key to work */}
              <input hidden type="submit" />
              <MilestoneForm {...{ organizationId }} />
            </Form>
          </EntityModalBody>
        </Fragment>
      )}
    </EntityModalForm>
  </EntityModalNext>
);

MilestoneAddModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
};

export default MilestoneAddModal;
