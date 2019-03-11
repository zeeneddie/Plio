import React from 'react';
import { ApolloProvider, Query } from 'react-apollo';
import { Provider } from 'react-redux';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { propOr } from 'ramda';

import { client } from '../../../apollo';
import store from '../../../store';
import { Query as Queries } from '../../../graphql';
import { composeWithTracker } from '../../../util';
import { Organizations } from '../../../../share/collections';
import { FlowRouterContext } from '../../components/FlowRouter';
import RenderSwitch from '../../components/RenderSwitch';
import ErrorPage from '../../components/ErrorPage';
import PreloaderPage from '../../components/PreloaderPage';
import { withUpdateLastAccessedDate } from '../../helpers';
import DashboardPage from '../components/DashboardPage';
import { getMetrics, getRouteName, getIconName, getMetricText } from '../helpers';
import { OrgSubs } from '../../../../startup/client/subsmanagers';

const COUNT_QUERY_POLL_INTERVAL = 60000;

const getItems = ({ __typename, ...counts }, organization) => Object.keys(counts).map((key) => {
  const { serialNumber, homeScreenTitles } = organization;
  const { totalCount, notViewedCount } = counts[key];

  return {
    title: homeScreenTitles[key],
    href: FlowRouter.path(getRouteName(key), { orgSerialNumber: serialNumber }),
    icon: getIconName(key),
    text: getMetrics(getMetricText(key), totalCount),
    label: notViewedCount ? `${notViewedCount} new` : '',
  };
});

const enhance = composeWithTracker(({ orgSerialNumber }, onData) => {
  if (orgSerialNumber) {
    onData(null, { organization: null, loading: true, error: null });

    const serialNumber = parseInt(orgSerialNumber, 10);
    const subscription = OrgSubs.subscribe(
      'currentUserOrganizationBySerialNumber',
      serialNumber,
      {
        onError: error => onData(null, { organization: null, loading: false, error }),
      },
    );

    if (subscription.ready()) {
      const organization = Organizations.findOne({ serialNumber });

      onData(null, { organization, loading: false, error: null });
    }
  }
});

const Container = enhance(({ children, ...props }) => children(props));
const DashboardPageContainer = withUpdateLastAccessedDate(DashboardPage);

const DashboardLayout = () => (
  <ApolloProvider {...{ client }}>
    <Provider {...{ store }}>
      <FlowRouterContext getParam="orgSerialNumber">
        {({ orgSerialNumber }) => (
          <Container {...{ orgSerialNumber }}>
            {({ loading, error, organization }) => (
              <RenderSwitch
                {...{ loading, error }}
                require={organization}
                renderLoading={PreloaderPage}
                renderError={err => <ErrorPage error={err} />}
                errorWhenMissing={() => `You have no access to organization ${orgSerialNumber}`}
              >
                {org => (
                  <Query
                    query={Queries.COUNTS}
                    variables={{ organizationId: org._id }}
                    pollInterval={COUNT_QUERY_POLL_INTERVAL}
                    skip={!org._id}
                  >
                    {({ data }) => (
                      <DashboardPageContainer
                        organization={org}
                        items={getItems(propOr({}, 'counts', data), organization)}
                      />
                    )}
                  </Query>
                )}
              </RenderSwitch>
            )}
          </Container>
        )}
      </FlowRouterContext>
    </Provider>
  </ApolloProvider>
);

export default DashboardLayout;
