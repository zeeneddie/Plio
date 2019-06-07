import PropTypes from 'prop-types';
import React, { Fragment, memo } from 'react';
import { Form } from 'reactstrap';

import {
  EntityModalNext,
  EntityModalHeader,
  EntityModalBody,
  EntityModalForm,
  CardBlock,
} from '../../components';
import OrganizationForm from './OrganizationForm';

const OrganizationCreateModal = memo(({
  isOpen,
  toggle,
  onSubmit,
  initialValues,
}) => (
  <EntityModalNext {...{ isOpen, toggle }}>
    <EntityModalForm
      {...{ initialValues, onSubmit }}
      keepDirtyOnReinitialize
    >
      {({ handleSubmit }) => (
        <Fragment>
          <EntityModalHeader label="New organization" />
          <EntityModalBody>
            <CardBlock>
              <Form onSubmit={handleSubmit}>
                {/* hidden input is needed for return key to work */}
                <input hidden type="submit" />
                <OrganizationForm />
              </Form>
            </CardBlock>
          </EntityModalBody>
        </Fragment>
      )}
    </EntityModalForm>
  </EntityModalNext>
));

OrganizationCreateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  initialValues: PropTypes.object,
};

export default OrganizationCreateModal;
