import PropTypes from 'prop-types';
import React from 'react';
import { Query } from 'react-apollo';

import { RenderSwitch, PreloaderPage, ErrorPage } from '../../components';
import CanvasPage from '../components/CanvasPage';
import withUpdateLastAccessedDate from '../../helpers/withUpdateLastAccessedDate';
import { Query as Queries } from '../../../graphql';
import CanvasPageSubscriber from './CanvasPageSubscriber';

const QUERY_POLLING_INTERVAL = 15 * 1000;

const CanvasPageContainer = ({ organization: { _id: organizationId } }) => (
  <Query
    query={Queries.CANVAS_PAGE}
    variables={{ organizationId }}
    pollInterval={QUERY_POLLING_INTERVAL}
  >
    {({ error, loading, subscribeToMore }) => (
      <RenderSwitch
        {...{ error, loading }}
        renderLoading={<PreloaderPage />}
        renderError={queryError => <ErrorPage error={queryError} />}
      >
        {() => (
          <CanvasPageSubscriber {...{ organizationId }} subscribe={subscribeToMore}>
            <CanvasPage {...{ organizationId }} />
          </CanvasPageSubscriber>
        )}
      </RenderSwitch>
    )}
  </Query>
);

CanvasPageContainer.propTypes = {
  organization: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

export default withUpdateLastAccessedDate(CanvasPageContainer);
