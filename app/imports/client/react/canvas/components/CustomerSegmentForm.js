import PropTypes from 'prop-types';
import React from 'react';
import { mapEntitiesToOptions } from 'plio-util';
import { pure } from 'recompose';

import { swal } from '../../../util';
import { Query } from '../../../graphql';
import CanvasForm from './CanvasForm';
import { FormField, ApolloSelectInputField, PercentInputField } from '../../components';
import { OptionNone } from '../../../../api/constants';

const CustomerSegmentForm = ({
  organizationId,
  save,
}) => (
  <CanvasForm {...{ organizationId, save }}>
    <FormField>
      Matched to
      <ApolloSelectInputField
        name="matchedTo"
        placeholder="Matched to"
        onChange={save}
        loadOptions={query => query({
          query: Query.VALUE_PROPOSITION_LIST,
          variables: { organizationId },
        }).then(({ data: { valuePropositions: { valuePropositions } } }) => ({
          options: [
            OptionNone,
            ...mapEntitiesToOptions(valuePropositions),
          ],
        })).catch(swal.error)}
      />
    </FormField>
    <FormField>
      % of market size
      <PercentInputField
        name="percentOfMarketSize"
        onBlur={save}
      />
    </FormField>
  </CanvasForm>
);

CustomerSegmentForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  save: PropTypes.func,
};

export default pure(CustomerSegmentForm);
