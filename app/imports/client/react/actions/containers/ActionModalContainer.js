import React from 'react';
import connectUI from 'redux-ui';
import { connect } from 'react-redux';
import { namedCompose } from '../../helpers';
import ActionEditModalContainer from './ActionEditModalContainer';
import ActionAddModalContainer from './ActionAddModalContainer';

const enhance = namedCompose('ActionModalContainer')(
  connect(),
  connectUI(),
);

export default enhance(({
  ui: {
    activeGoal: goalId,
    activeAction: actionId,
  },
  isOpen,
  toggle,
  organizationId,
  user,
}) => {
  if (!goalId) return null;

  if (!actionId) {
    return (
      <ActionAddModalContainer
        {...{
          isOpen,
          toggle,
          organizationId,
          user,
          actionId,
          goalId,
        }}
      />
    );
  }

  return (
    <ActionEditModalContainer
      {...{
        isOpen,
        toggle,
        organizationId,
        user,
        actionId,
        goalId,
      }}
    />
  );
});
