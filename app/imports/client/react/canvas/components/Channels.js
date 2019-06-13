import PropTypes from 'prop-types';
import React from 'react';
import { Query } from 'react-apollo';
import { pure } from 'recompose';

import ChannelAddModal from './ChannelAddModal';
import ChannelEditModal from './ChannelEditModal';
import CanvasBlock from './CanvasBlock';
import ChannelsHelp from './ChannelsHelp';
import { Query as Queries } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { CanvasSections, CanvasTypes, DocumentTypes } from '../../../../share/constants';

const Channels = ({ organizationId }) => (
  <Query
    query={Queries.CHANNELS}
    variables={{ organizationId }}
    fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}
  >
    {({ data: { channels: { channels = [] } } }) => (
      <CanvasBlock
        {...{ organizationId }}
        label="Channels"
        sectionName={CanvasSections[CanvasTypes.CHANNEL]}
        documentType={DocumentTypes.CHANNEL}
        help={<ChannelsHelp />}
        items={channels}
        renderModal={({ isOpen, toggle, onLink }) => (
          <ChannelAddModal
            {...{
              isOpen,
              toggle,
              organizationId,
              onLink,
            }}
          />
        )}
        renderEditModal={({ isOpen, toggle, _id }) => (
          <ChannelEditModal
            {...{
              isOpen,
              toggle,
              organizationId,
              _id,
            }}
          />
        )}
      />
    )}
  </Query>
);

Channels.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default pure(Channels);
