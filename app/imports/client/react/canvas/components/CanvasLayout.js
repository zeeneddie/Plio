import React from 'react';
import { ApolloProvider, Query } from 'react-apollo';

import { client } from '../../../apollo';
import { Query as Queries } from '../../../graphql';
import { PreloaderPage, FlowRouterContext, RenderSwitch } from '../../components';
import CanvasPage from './CanvasPage';

const CanvasLayout = () => (
  <ApolloProvider {...{ client }}>
    <FlowRouterContext getParam="orgSerialNumber">
      {({ orgSerialNumber }) => (
        <Query query={Queries.CANVAS_PAGE} variables={{ orgSerialNumber }}>
          {({ loading, error, data }) => (
            <RenderSwitch
              {...{ loading, error }}
              require={data && data.organization}
              renderLoading={() => <PreloaderPage />}
              // TODO: handle errors
            >
              {({ _id: organizationId }) => (
                <CanvasPage {...{ organizationId }} />
              )}
            </RenderSwitch>
          )}
        </Query>
      )}
    </FlowRouterContext>
  </ApolloProvider>
);

export default CanvasLayout;
