import React from 'react';
import PropTypes from 'prop-types';

import ActionAddContainer from './ActionAddContainer';
import ActionEditContainer from './ActionEditContainer';
import ActionAddModal from '../components/ActionAddModal';
import ActionEditModal from '../components/ActionEditModal';

const ActionModalContainer = ({
  isOpen,
  toggle,
  organizationId,
  user,
  refetchQueries,
  type,
  linkedTo,
  actionId,
  actionIds,
  linkedToField,
}) => {
  if (!actionId) {
    return (
      <ActionAddContainer
        {...{
          isOpen,
          toggle,
          organizationId,
          user,
          refetchQueries,
          type,
          linkedTo,
          actionIds,
          linkedToField,
        }}
        render={ActionAddModal}
      />
    );
  }

  return (
    <ActionEditContainer
      {...{
        isOpen,
        toggle,
        organizationId,
        user,
        actionId,
        refetchQueries,
        type,
        linkedToField,
      }}
      render={ActionEditModal}
    />
  );
};

ActionModalContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  actionIds: PropTypes.array,
  refetchQueries: PropTypes.func,
  linkedTo: PropTypes.object,
  linkedToField: PropTypes.object,
  actionId: PropTypes.string,
};

export default ActionModalContainer;
