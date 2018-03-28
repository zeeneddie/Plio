import PropTypes from 'prop-types';
import React from 'react';
import Loadable from 'react-loadable';

import { PreloaderPage } from '../../components';
import DashboardCard from './DashboardCard';
import DashboardUserStatsContainer from '../containers/DashboardUserStatsContainer';
import DashboardStatsUnreadMessagesContainer
  from '../containers/DashboardStatsUnreadMessagesContainer';
import DashboardStatsOverdueItemsContainer from '../containers/DashboardStatsOverdueItemsContainer';

const LoadableDashboardGoalsContainer = Loadable({
  loader: () => import('../containers/DashboardGoalsContainer'),
  loading: () => <PreloaderPage size={2} />,
});

const DashboardPage = ({ items = [], organization }) => (
  <div>
    <div className="dashboard-items">
      {items.map(item => (
        <div key={`${item.title}-${item.href}`}>
          <DashboardCard {...item} />
        </div>
      ))}
    </div>
    <LoadableDashboardGoalsContainer {...{ organization }} />
    <DashboardUserStatsContainer {...{ organization }} />
    <DashboardStatsUnreadMessagesContainer {...{ organization }} />
    <DashboardStatsOverdueItemsContainer {...{ organization }} />
  </div>
);

DashboardPage.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  organization: PropTypes.object.isRequired,
};

export default DashboardPage;
