/* eslint-disable react/prop-types */

import React from 'react';
import connectUI from 'redux-ui';
import { connect } from 'react-redux';
import { withHandlers } from 'recompose';

import { DocumentTypes } from '../../../../share/constants';
import { namedCompose } from '../../helpers';
import MilestoneAddContainer from './MilestoneAddContainer';
import MilestoneEditContainer from './MilestoneEditContainer';
import MilestoneEditModal from '../components/MilestoneEditModal';
import MilestoneAddModal from '../components/MilestoneAddModal';
import { RelationsAdapter } from '../../components';
import { Query as Queries } from '../../../graphql';

const enhance = namedCompose('MilestoneModalContainer')(
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
  ui: { activeGoal: goalId, activeMilestone },
  isOpen,
  toggle,
  organizationId,
  refetchQueries,
}) => {
  if (!goalId) return null;

  if (!activeMilestone) {
    return (
      <RelationsAdapter
        {...{
          goalId,
          organizationId,
          isOpen,
          toggle,
          refetchQueries,
        }}
        documentId={goalId}
        documentType={DocumentTypes.GOAL}
        relatedDocumentType={DocumentTypes.MILESTONE}
        component={MilestoneAddContainer}
        render={MilestoneAddModal}
      />
    );
  }

  return (
    <RelationsAdapter
      {...{
        organizationId,
        isOpen,
        toggle,
        refetchQueries,
      }}
      milestoneId={activeMilestone}
      documentId={goalId}
      documentType={DocumentTypes.GOAL}
      relatedDocumentType={DocumentTypes.MILESTONE}
      component={MilestoneEditContainer}
      render={MilestoneEditModal}
    />
  );
});
