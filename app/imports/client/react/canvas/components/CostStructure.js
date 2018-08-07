import PropTypes from 'prop-types';
import React from 'react';
import { Query } from 'react-apollo';
import { pure } from 'recompose';

import CostLineAddModal from './CostLineAddModal';
import CanvasBlock from './CanvasBlock';
import { Query as Queries } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { CanvasSections } from '../../../../share/constants';

const CostStructure = ({ organizationId }) => (
  <Query
    query={Queries.COST_LINES}
    variables={{ organizationId }}
    fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}
  >
    {({ data: { costLines: { costLines = [] } } }) => (
      <CanvasBlock
        {...{ organizationId }}
        label="Cost structure"
        sectionName={CanvasSections.COST_STRUCTURE}
        help={(
          <p>
            What are the main elements of operational expense
            {' '}
            (including variable costs, inventory, WIP and capital assets)?
          </p>
        )}
        items={costLines}
        renderModal={({ isOpen, toggle }) => (
          <CostLineAddModal {...{ isOpen, toggle, organizationId }} />
        )}
      />
    )}
  </Query>
);

CostStructure.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default pure(CostStructure);

