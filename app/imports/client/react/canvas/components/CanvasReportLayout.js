import React, { createContext } from 'react';
import { ApolloProvider, Query } from 'react-apollo';

import { client } from '../../../apollo';
import { Query as Queries } from '../../../graphql';
import {
  PreloaderPage,
  FlowRouterContext,
  RenderSwitch,
  NotFoundPage,
  ErrorPage,
} from '../../components';
import Errors from '../../../../share/errors';
import CanvasReportPage from './CanvasReportPage';

const { Provider, Consumer } = createContext({});

const CanvasReportLayout = () => (
  <ApolloProvider {...{ client }}>
    <FlowRouterContext getParam="orgSerialNumber">
      {({ orgSerialNumber }) => (
        <Query
          query={Queries.CANVAS_REPORT_LAYOUT}
          variables={{ orgSerialNumber }}
          skip={!orgSerialNumber}
        >
          {({ loading, error, data }) => (
            <RenderSwitch
              {...{ loading, error }}
              require={data && data.organization}
              renderLoading={<PreloaderPage />}
              renderError={queryError =>
                queryError === Errors.NOT_ORG_MEMBER ? (
                  <NotFoundPage
                    subject="organization"
                    subjectId={orgSerialNumber}
                  />
                ) : (
                  <ErrorPage error={queryError} />
                )
              }
            >
              {organization => (
                <Provider value={{ organization }}>
                  <CanvasReportPage {...{ organization }} />
                </Provider>
              )}
            </RenderSwitch>
          )}
        </Query>
      )}
    </FlowRouterContext>
  </ApolloProvider>
);

export { Consumer };

export default CanvasReportLayout;
