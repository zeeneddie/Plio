import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Query } from 'react-apollo';

import KeyResourceAddModal from './KeyResourceAddModal';
import CanvasBlock from './CanvasBlock';
import { Query as Queries } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';

const KeyResources = ({ organizationId }) => (
  <Query
    query={Queries.KEY_RESOURCES}
    variables={{ organizationId }}
    fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}
  >
    {({ data: { keyResources: { keyResources = [] } } }) => (
      <CanvasBlock
        label="Key resources"
        help={(
          <Fragment>
            <p>What key resources do our key activities require?</p>
          </Fragment>
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

export default KeyResources;
