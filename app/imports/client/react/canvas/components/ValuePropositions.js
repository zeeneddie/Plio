import PropTypes from 'prop-types';
import React from 'react';
import { Query } from 'react-apollo';

import ValuePropositionAddModal from './ValuePropositionAddModal';
import ValuePropositionEditModal from './ValuePropositionEditModal';
import CanvasBlock from './CanvasBlock';
import ValuePropositionsHelp from './ValuePropositionsHelp';
import { Query as Queries } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { CanvasSections, CanvasTypes, DocumentTypes } from '../../../../share/constants';

const ValuePropositions = ({ organizationId }) => (
  <Query
    query={Queries.VALUE_PROPOSITIONS}
    variables={{ organizationId }}
    fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}
  >
    {({ data: { valuePropositions: { valuePropositions = [] } } }) => (
      <CanvasBlock
        {...{ organizationId }}
        label="Value propositions"
        sectionName={CanvasSections[CanvasTypes.VALUE_PROPOSITION]}
        documentType={DocumentTypes.VALUE_PROPOSITION}
        help={<ValuePropositionsHelp />}
        items={valuePropositions}
        renderModal={({ isOpen, toggle, onLink }) => (
          <ValuePropositionAddModal
            {...{
              isOpen,
              toggle,
              organizationId,
              onLink,
            }}
          />
        )}
        renderEditModal={({ isOpen, toggle, _id }) => (
          <ValuePropositionEditModal
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

ValuePropositions.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default React.memo(ValuePropositions);
