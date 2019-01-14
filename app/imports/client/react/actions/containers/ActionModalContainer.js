import React from 'react';
import connectUI from 'redux-ui';
import { connect } from 'react-redux';
import { withHandlers } from 'recompose';

import { Query as Queries } from '../../../graphql';
import { namedCompose } from '../../helpers';
import ActionAddContainer from './ActionAddContainer';
import ActionEditContainer from './ActionEditContainer';
import ActionAddModal from '../components/ActionAddModal';
import ActionEditModal from '../components/ActionEditModal';

const enhance = namedCompose('ActionModalContainer')(
  connect(),
  connectUI(),
  withHandlers({
    refetchQueries: ({ ui: { activeGoal } }) => () => activeGoal ? [
      {
        query: Queries.DASHBOARD_GOAL,
        variables: { _id: activeGoal },
      },
    ] : [],
  }),
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
  refetchQueries,
  type,
  documentType,
}) => {
  if (!goalId) return null;

  if (!actionId) {
    return (
      <ActionAddContainer
        {...{
          isOpen,
          toggle,
          organizationId,
          user,
          goalId,
          refetchQueries,
          type,
        }}
        linkedTo={{
          documentId: goalId,
          documentType,
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
        goalId,
        refetchQueries,
        type,
      }}
      linkedTo={{
        _id: goalId,
      }}
      render={ActionEditModal}
    />
  );
});
