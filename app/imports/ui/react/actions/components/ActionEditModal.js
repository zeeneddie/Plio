import PropTypes from 'prop-types';
import React from 'react';
import { noop } from 'plio-util';

import { EntityModal } from '../../components';
import GeneralActionEditFormContainer from '../containers/GeneralActionEditFormContainer';

// TODO: make this component universal for all types of actions

const ActionEditModal = ({
  isOpen,
  toggle,
  loading,
  initialValues,
  onDelete,
  action = {},
  ...props
}) => (
  <EntityModal
    {...{
      isOpen,
      toggle,
      loading,
      initialValues,
      onDelete,
    }}
    showSubmitBtn={false}
    title="Action"
    onSave={noop}
  >
    <GeneralActionEditFormContainer {...{ ...props, ...action }} />
  </EntityModal>
);

ActionEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  initialValues: PropTypes.object,
  onDelete: PropTypes.func,
  action: PropTypes.object,
  organizationId: PropTypes.string.isRequired,
};

export default ActionEditModal;
