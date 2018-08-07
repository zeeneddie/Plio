import PropTypes from 'prop-types';
import React from 'react';
import { Query } from 'react-apollo';
import { pure } from 'recompose';

import KeyResourceAddModal from './KeyResourceAddModal';
import CanvasBlock from './CanvasBlock';
import { Query as Queries } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { CanvasSections } from '../../../../share/constants';

const KeyResources = ({ organizationId }) => (
  <Query
    query={Queries.KEY_RESOURCES}
    variables={{ organizationId }}
    fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}
  >
    {({ data: { keyResources: { keyResources = [] } } }) => (
      <CanvasBlock
        {...{ organizationId }}
        label="Key resources"
        sectionName={CanvasSections.KEY_RESOURCES}
        help={(
          <p>What key resources do our key activities require?</p>
        )}
        items={keyResources}
        renderModal={({ isOpen, toggle }) => (
          <KeyResourceAddModal {...{ isOpen, toggle, organizationId }} />
        )}
      />
    )}
  </Query>
);

KeyResources.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default pure(KeyResources);
