import PropTypes from 'prop-types';
import React from 'react';
import { Query } from 'react-apollo';
import { pure } from 'recompose';

import CustomerRelationshipAddModal from './CustomerRelationshipAddModal';
import CustomerRelationshipEditModal from './CustomerRelationshipEditModal';
import CanvasBlock from './CanvasBlock';
import CustomerRelationshipsHelp from './CustomerRelationshipsHelp';
import { Query as Queries } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { CanvasSections, CanvasTypes, DocumentTypes } from '../../../../share/constants';

const CustomerRelationships = ({ organizationId }) => (
  <Query
    query={Queries.CUSTOMER_RELATIONSHIPS}
    variables={{ organizationId }}
    fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}
  >
    {({ data: { customerRelationships: { customerRelationships = [] } } }) => (
      <CanvasBlock
        {...{ organizationId }}
        label="Customer relationships"
        sectionName={CanvasSections[CanvasTypes.CUSTOMER_RELATIONSHIP]}
        documentType={DocumentTypes.CUSTOMER_RELATIONSHIP}
        help={<CustomerRelationshipsHelp />}
        items={customerRelationships}
        renderModal={({ isOpen, toggle, onLink }) => (
          <CustomerRelationshipAddModal
            {...{
              isOpen,
              toggle,
              organizationId,
              onLink,
            }}
          />
        )}
        renderEditModal={({ isOpen, toggle, _id }) => (
          <CustomerRelationshipEditModal
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

CustomerRelationships.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default pure(CustomerRelationships);
