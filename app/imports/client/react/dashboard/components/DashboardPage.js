import PropTypes from 'prop-types';
import React from 'react';
import Loadable from 'react-loadable';
import styled from 'styled-components';
import Blaze from 'meteor/gadicc:blaze-react-component';

import { Styles } from '../../../../api/constants';
import { PreloaderPage } from '../../components';
import DashboardCard from './DashboardCard';
import DashboardUserStatsContainer from '../containers/DashboardUserStatsContainer';
import DashboardStatsUnreadMessagesContainer
  from '../containers/DashboardStatsUnreadMessagesContainer';
import DashboardStatsOverdueItemsContainer from '../containers/DashboardStatsOverdueItemsContainer';
import MainHeader from '../../main-header/components/MainHeader';

const LoadableDashboardGoalsContainer = Loadable({
  loader: () => import('../containers/DashboardGoalsContainer'),
  loading: () => <PreloaderPage size={2} />,
});

const DashboardPageWrapper = styled.div`
  background-color: ${Styles.background.color.white};
`;

const DashboardPage = ({ items = [], organization }) => (
  <DashboardPageWrapper>
    <MainHeader isDashboard {...{ organization }} />
    <div className="content no-flex scroll">
      <div className="container">
        <div className="row">
          <div className="content-cards col-sm-12">
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
            <Blaze template="Dashboard_Footer" />
          </div>
        </div>
      </div>
    </div>
  </DashboardPageWrapper>
);

DashboardPage.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  organization: PropTypes.object.isRequired,
};

export default DashboardPage;
