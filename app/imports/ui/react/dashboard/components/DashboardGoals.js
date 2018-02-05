import PropTypes from 'prop-types';
import React from 'react';
import pluralize from 'pluralize';
import { joinIds } from 'plio-util';

import {
  DashboardStatsExpandable,
  IconLoading,
  PlusButton,
  GoalsChart,
} from '../../components';
import { GoalAddModalContainer, GoalEditModalContainer } from '../../goals/containers';

const DashboardGoals = ({
  totalCount,
  goals,
  onLineTap,
  toggle,
  isOpen,
  loading,
  isAddModalOpen,
  toggleAddModal,
  userId,
  organizationId,
  isEditModalOpen,
  toggleEditModal,
}) => (
  <DashboardStatsExpandable
    items={goals}
    total={totalCount}
    itemsPerRow={goals.length}
    renderIcon={loading ? () => <IconLoading /> : undefined}
    render={({ items }) => !!items.length && (
      <GoalsChart
        key={joinIds(items)}
        goals={items}
        onScatterTap={toggleEditModal}
        {...{ onLineTap }}
      />
    )}
    {...{ toggle, isOpen }}
  >
    <PlusButton size="1" onClick={toggleAddModal} />
    {pluralize('goal', totalCount || goals.length, true)}
    <GoalAddModalContainer
      isOpen={isAddModalOpen}
      toggle={toggleAddModal}
      ownerId={userId}
      {...{ organizationId }}
    />
    <GoalEditModalContainer
      isOpen={isEditModalOpen}
      toggle={toggleEditModal}
      {...{ organizationId }}
    />
  </DashboardStatsExpandable>
);

DashboardGoals.propTypes = {
  totalCount: PropTypes.number.isRequired,
  goals: PropTypes.arrayOf(PropTypes.object).isRequired,
  // zoomDomain: ?
  onZoom: PropTypes.func,
  onLineTap: PropTypes.func,
  onScatterTap: PropTypes.func,
  toggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  isAddModalOpen: PropTypes.bool.isRequired,
  toggleAddModal: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  userId: PropTypes.string.isRequired,
  organizationId: PropTypes.string.isRequired,
  isEditModalOpen: PropTypes.bool.isRequired,
  toggleEditModal: PropTypes.func.isRequired,
};

export default DashboardGoals;
