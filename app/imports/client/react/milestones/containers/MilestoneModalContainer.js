/* eslint-disable react/prop-types */

import React from 'react';
import connectUI from 'redux-ui';
import { connect } from 'react-redux';

import { namedCompose } from '../../helpers';
import MilestoneAddContainer from './MilestoneAddContainer';
import MilestoneEditContainer from './MilestoneEditContainer';
import MilestoneEditModal from '../components/MilestoneEditModal';
import MilestoneAddModal from '../components/MilestoneAddModal';

const enhance = namedCompose('MilestoneModalContainer')(
  connect(),
  connectUI(),
);

export default enhance(({
  ui: { activeGoal, activeMilestone },
  isOpen,
  toggle,
  organizationId,
}) => {
  if (!activeGoal) return null;

  if (!activeMilestone) {
    return (
      <MilestoneAddContainer
        {...{ isOpen, toggle, organizationId }}
        component={MilestoneAddModal}
        goalId={activeGoal}
      />
    );
  }

  return (
    <MilestoneEditContainer
      {...{ isOpen, toggle, organizationId }}
      milestoneId={activeMilestone}
      component={MilestoneEditModal}
      key={activeMilestone}
    />
  );
});
