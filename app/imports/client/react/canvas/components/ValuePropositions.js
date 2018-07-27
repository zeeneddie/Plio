import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Query } from 'react-apollo';

import ValuePropositionAddModal from './ValuePropositionAddModal';
import CanvasBlock from './CanvasBlock';
import { Query as Queries } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';

const ValuePropositions = ({ organizationId }) => (
  <Query
    query={Queries.VALUE_PROPOSITIONS}
    variables={{ organizationId }}
    fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}
  >
    {({ data: { valuePropositions: { valuePropositions = [] } } }) => (
      <CanvasBlock
        label="Value propositions"
        help={(
          <Fragment>
            {/* eslint-disable react/no-unescaped-entities */}
            <p>Which of our customer's problems are we helping to solve?</p>
            <p>What does a winning value proposition look like, vs today's?</p>
            {/* eslint-disable react/no-unescaped-entities */}
          </Fragment>
        )}
        items={valuePropositions}
        renderModal={({ isOpen, toggle }) => (
          <ValuePropositionAddModal {...{ isOpen, toggle, organizationId }} />
        )}
      />
    )}
  </Query>
);

ValuePropositions.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default ValuePropositions;
