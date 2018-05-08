import PropTypes from 'prop-types';
import React from 'react';

import { EntityModal } from '../../components';
import NewActionForm from '../components/NewActionForm';

const ActionAddModal = ({
  isOpen,
  toggle,
  loading,
  initialValues,
  onSave,
  ...props
}) => (
  <EntityModal
    {...{
      isOpen,
      toggle,
      loading,
      initialValues,
      onSave,
    }}
    showSubmitBtn
    title="Action"
  >
    <NewActionForm {...props} />
  </EntityModal>
);

ActionAddModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
  onSave: PropTypes.func.isRequired,
};

export default ActionAddModal;
