import PropTypes from 'prop-types';
import React from 'react';
import { Query } from 'react-apollo';
import { pure } from 'recompose';

import KeyResourceAddModal from './KeyResourceAddModal';
import KeyResourceEditModal from './KeyResourceEditModal';
import CanvasBlock from './CanvasBlock';
import KeyResourcesHelp from './KeyResourcesHelp';
import { Query as Queries } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { CanvasSections, CanvasTypes } from '../../../../share/constants';

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
        sectionName={CanvasSections[CanvasTypes.KEY_RESOURCE]}
        help={<KeyResourcesHelp />}
        items={keyResources}
        renderModal={({ isOpen, toggle, onLink }) => (
          <KeyResourceAddModal
            {...{
              isOpen,
              toggle,
              organizationId,
              onLink,
            }}
          />
        )}
        renderEditModal={({ isOpen, toggle, _id }) => (
          <KeyResourceEditModal
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

KeyResources.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default pure(KeyResources);
