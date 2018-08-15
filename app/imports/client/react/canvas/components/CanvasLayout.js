import React, { Fragment } from 'react';
import { ApolloProvider, Query } from 'react-apollo';

import { client } from '../../../apollo';
import { Query as Queries } from '../../../graphql';
import { PreloaderPage, FlowRouterContext, RenderSwitch } from '../../components';
import MainHeader from '../../main-header/components/MainHeader';
import CanvasPage from './CanvasPage';

const CanvasLayout = () => (
  <ApolloProvider {...{ client }}>
    <FlowRouterContext getParam="orgSerialNumber">
      {({ orgSerialNumber }) => (
        <Query
          query={Queries.CANVAS_LAYOUT}
          variables={{ orgSerialNumber }}
          skip={!orgSerialNumber}
        >
          {({ loading, error, data }) => (
            <RenderSwitch
              {...{ loading, error }}
              require={data && data.organization}
              renderLoading={<PreloaderPage />}
              // TODO: handle errors
            >
              {organization => (
                <Fragment>
                  <MainHeader {...{ organization }} />
                  <CanvasPage organizationId={organization._id} />
                </Fragment>
              )}
            </RenderSwitch>
          )}
        </Query>
      )}
    </FlowRouterContext>
  </ApolloProvider>
);

export default CanvasLayout;
