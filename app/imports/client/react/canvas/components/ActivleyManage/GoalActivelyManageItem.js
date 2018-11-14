import React from 'react';
import PropTypes from 'prop-types';

import { EntityManagerItem } from '../../../components';
import { NewGoalCard, GoalAddContainer } from '../../../goals';
import ActivelyManageItem from './ActivelyManageItem';

const GoalActivelyManageItem = ({ organizationId, onLink }) => (
  <EntityManagerItem
    {...{ organizationId, onLink }}
    itemId="keyGoal"
    label="Key goal"
    component={GoalAddContainer}
    render={ActivelyManageItem}
  >
    <NewGoalCard {...{ organizationId }} />
  </EntityManagerItem>
);

GoalActivelyManageItem.propTypes = {
  organizationId: PropTypes.string.isRequired,
  onLink: PropTypes.func.isRequired,
};

export default GoalActivelyManageItem;