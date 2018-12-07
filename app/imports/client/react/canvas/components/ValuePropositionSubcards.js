import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { Query as Queries } from '../../../graphql';
import { AWSDirectives, CanvasTypes } from '../../../../share/constants';
import ValueComponentsSubcard from './ValueComponentsSubcard';
import CanvasSubcards from './CanvasSubcards';

const ValuePropositionSubcards = ({
  organizationId,
  valueProposition,
  onChange,
  user,
}) => (
  <Fragment>
    <ValueComponentsSubcard
      {...{ organizationId }}
      benefits={valueProposition.benefits || []}
      features={valueProposition.features || []}
      documentId={valueProposition._id}
      matchedTo={valueProposition.matchedTo}
      documentType={CanvasTypes.VALUE_PROPOSITION}
    />
    <CanvasSubcards
      {...{ organizationId, onChange, user }}
      section={valueProposition}
      refetchQuery={Queries.VALUE_PROPOSITION_CARD}
      documentType={CanvasTypes.VALUE_PROPOSITION}
      slingshotDirective={AWSDirectives.VALUE_PROPOSITION_FILES}
    />
  </Fragment>
);

ValuePropositionSubcards.propTypes = {
  valueProposition: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  user: PropTypes.object,
};

export default ValuePropositionSubcards;
