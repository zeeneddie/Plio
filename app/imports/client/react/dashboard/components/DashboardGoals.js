import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import pluralize from 'pluralize';

import {
  DashboardStatsExpandable,
  IconLoading,
  PlusButton,
} from '../../components';
import { WithToggle } from '../../helpers';
import GoalsChartContainer from '../../goals/containers/GoalsChartContainer';
import GoalAddContainer from '../../goals/containers/GoalAddContainer';
import GoalEditModalContainer from '../../goals/containers/GoalEditModalContainer';
import CompletedDeletedGoalsContainer from '../../goals/containers/CompletedDeletedGoalsContainer';
import GoalAddModal from '../../goals/components/GoalAddModal';
import MilestoneModalContainer from '../../milestones/containers/MilestoneModalContainer';
import GoalActionModal from '../../goals/components/GoalActionModal';

const DashboardGoals = ({
  totalCount,
  completedDeletedTotalCount,
  goals,
  toggle,
  isOpen,
  loading,
  user,
  organizationId,
  isEditModalOpen,
  toggleEditModal,
  completedDeletedItemsPerRow,
  timeScale,
  canEditGoals,
  isMilestoneModalOpen,
  toggleMilestoneModal,
  isActionModalOpen,
  toggleActionModal,
}) => (
  <WithToggle>
    {addModalToggleState => (
      <Fragment>
        {canEditGoals && (
          <GoalAddContainer
            {...{ ...addModalToggleState, organizationId }}
            component={GoalAddModal}
          />
        )}
        {!!goals.length && (
          <Fragment>
            <GoalEditModalContainer
              isOpen={isEditModalOpen}
              toggle={toggleEditModal}
              {...{ organizationId }}
            />
            <MilestoneModalContainer
              isOpen={isMilestoneModalOpen}
              toggle={toggleMilestoneModal}
              {...{ organizationId }}
            />
            <GoalActionModal
              isOpen={isActionModalOpen}
              toggle={toggleActionModal}
              {...{ organizationId, user, goals }}
            />
          </Fragment>
        )}
        <DashboardStatsExpandable
          items={goals}
          total={completedDeletedTotalCount ? Infinity : totalCount}
          itemsPerRow={goals.length}
          renderIcon={loading ? () => <IconLoading /> : undefined}
          render={({ items }) => (
            <Fragment>
              {!!items.length && (
                <GoalsChartContainer
                  {...{ timeScale }}
                  goals={items}
                />
              )}
              {isOpen && !!completedDeletedTotalCount && (
                <CompletedDeletedGoalsContainer
                  {...{ canEditGoals, organizationId }}
                  itemsPerRow={completedDeletedItemsPerRow}
                />
              )}
            </Fragment>
          )}
          {...{ toggle, isOpen }}
        >
          {canEditGoals && <PlusButton size="1" onClick={addModalToggleState.toggle} />}
          {totalCount
            ? pluralize('Key goal', totalCount || goals.length, true)
            : 'Add a key goal'}
        </DashboardStatsExpandable>
      </Fragment>
    )}
  </WithToggle>
);

DashboardGoals.propTypes = {
  totalCount: PropTypes.number.isRequired,
  goals: PropTypes.arrayOf(PropTypes.object).isRequired,
  toggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  user: PropTypes.object.isRequired,
  organizationId: PropTypes.string.isRequired,
  isEditModalOpen: PropTypes.bool.isRequired,
  toggleEditModal: PropTypes.func.isRequired,
  timeScale: PropTypes.number.isRequired,
  isMilestoneModalOpen: PropTypes.bool.isRequired,
  toggleMilestoneModal: PropTypes.func.isRequired,
  isActionModalOpen: PropTypes.bool.isRequired,
  toggleActionModal: PropTypes.func.isRequired,
  limit: PropTypes.number,
  canEditGoals: PropTypes.bool,
  completedDeletedItemsPerRow: PropTypes.number,
  completedDeletedTotalCount: PropTypes.number,
};

export default DashboardGoals;
