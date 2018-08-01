import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import { pure } from 'recompose';

import ChannelAddModal from './ChannelAddModal';
import CanvasBlock from './CanvasBlock';
import { Query as Queries } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';

const Channels = ({ organizationId }) => (
  <Query
    query={Queries.CHANNELS}
    variables={{ organizationId }}
    fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}
  >
    {({ data: { channels: { channels = [] } } }) => (
      <CanvasBlock
        label="Channels"
        help={(
          <Fragment>
            <p>Through which channels do each of our segments want to be reached?</p>
            <p>Which ones are most cost-efficient?</p>
          </Fragment>
        )}
        items={channels}
        renderModal={({ isOpen, toggle }) => (
          <ChannelAddModal {...{ isOpen, toggle, organizationId }} />
        )}
      />
    )}
  </Query>
);

Channels.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default pure(Channels);
