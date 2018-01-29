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
import { GoalAddModalContainer } from '../containers';

const DashboardGoals = ({
  totalCount,
  goals,
  zoomDomain,
  onZoom,
  onLineTap,
  onScatterTap,
  toggle,
  isOpen,
  loading,
  isModalOpen,
  toggleModal,
}) => (
  <DashboardStatsExpandable
    items={goals}
    total={totalCount}
    itemsPerRow={goals.length}
    renderIcon={loading ? () => <IconLoading /> : undefined}
    render={({ items }) => (
      <GoalsChart
        key={joinIds(items)}
        goals={items}
      />
    )}
    {...{ toggle, isOpen }}
  >
    <PlusButton size="1" onClick={toggleModal} />
    {pluralize('goal', totalCount || goals.length, true)}
    <GoalAddModalContainer
      isOpen={isModalOpen}
      toggle={toggleModal}
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
  isModalOpen: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default DashboardGoals;
