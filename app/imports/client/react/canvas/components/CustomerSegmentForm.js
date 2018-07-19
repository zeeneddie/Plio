import PropTypes from 'prop-types';
import React from 'react';
import { mapEntitiesToOptions } from 'plio-util';

import { swal } from '../../../util';
import { Query } from '../../../graphql';
import CanvasForm from './CanvasForm';
import { FormField, ApolloSelectInputField, PercentInputField } from '../../components';

const CustomerSegmentForm = ({ organizationId }) => (
  <CanvasForm {...{ organizationId }}>
    <FormField>
      Matched to
      <ApolloSelectInputField
        name="matchedTo"
        placeholder="Matched to"
        loadOptions={query => query({
          query: Query.VALUE_PROPOSITION_LIST,
          variables: { organizationId },
        }).then(({ data: { valuePropositions: { valuePropositions } } }) => ({
          options: [
            { label: 'None', value: undefined },
            ...mapEntitiesToOptions(valuePropositions),
          ],
        })).catch(swal.error)}
      />
    </FormField>
    <FormField>
      % of market size
      <PercentInputField name="percentOfMarketSize" />
    </FormField>
  </CanvasForm>
);

CustomerSegmentForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default CustomerSegmentForm;
