import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Query } from 'react-apollo';

import KeyActivityAddModal from './KeyActivityAddModal';
import CanvasBlock from './CanvasBlock';
import { Query as Queries } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';

const KeyActivities = ({ organizationId }) => (
  <Query
    query={Queries.KEY_ACTIVITIES}
    variables={{ organizationId }}
    fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}
  >
    {({ data: { keyActivities: { keyActivities = [] } } }) => (
      <CanvasBlock
        label="Key activities"
        help={(
          <Fragment>
            <p>What are the key activities we need to create our value propositions?</p>
          </Fragment>
        )}
        items={keyActivities}
        renderModal={({ isOpen, toggle }) => (
          <KeyActivityAddModal {...{ isOpen, toggle, organizationId }} />
        )}
      />
    )}
  </Query>
);

KeyActivities.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default KeyActivities;
