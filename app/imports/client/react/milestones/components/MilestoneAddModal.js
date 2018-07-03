import PropTypes from 'prop-types';
import React from 'react';

import { EntityModal } from '../../components';
import MilestoneForm from './MilestoneForm';

const MilestoneAddModal = ({
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
    title="Milestone"
  >
    <MilestoneForm {...props} />
  </EntityModal>
);

MilestoneAddModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
  onSave: PropTypes.func.isRequired,
};

export default MilestoneAddModal;
