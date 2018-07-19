import PropTypes from 'prop-types';
import React from 'react';
import { noop } from 'plio-util';

import CanvasForm from './CanvasForm';
import { FormField, ApolloSelectInputField } from '../../components';

const ValuePropositionForm = ({ organizationId }) => (
  <CanvasForm {...{ organizationId }}>
    <FormField>
      Matched to
      <ApolloSelectInputField
        name="matchedTo"
        loadOptions={noop} // TODO: load customer segments
        placeholder="No customer segments available"
        disabled
      />
    </FormField>
  </CanvasForm>
);

ValuePropositionForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default ValuePropositionForm;
