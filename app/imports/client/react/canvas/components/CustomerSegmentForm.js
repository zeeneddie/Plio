import PropTypes from 'prop-types';
import React from 'react';
import { getEntityOptions, mapEntitiesToOptions } from 'plio-util';
import { pure } from 'recompose';

import { Query } from '../../../graphql';
import CanvasForm from './CanvasForm';
import { FormField, PercentInputField } from '../../components';
import CanvasMatchField from './CanvasMatchField';

const optionGuidance = {
  label: 'Select an unmatched proposition.\n' +
  '(Each customer segment can only be matched to 1 value proposition)',
  value: '',
};

const CustomerSegmentForm = ({
  organizationId,
  matchedTo,
  save,
}) => (
  <CanvasForm {...{ organizationId, save }}>
    <FormField>
      Matched to
      <CanvasMatchField
        name="matchedTo"
        placeholder="Matched to"
        onChange={save}
        loadOptions={query => query({
          query: Query.VALUE_PROPOSITION_LIST,
          variables: { organizationId, isUnmatched: true },
        })}
        transformOptions={({ data: { valuePropositions: { valuePropositions } } }) => {
          const options = [];

          if (matchedTo) options.push(getEntityOptions(matchedTo));

          options.push(
            ...mapEntitiesToOptions(valuePropositions),
            optionGuidance,
          );

          return options;
        }}
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
  matchedTo: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }),
  save: PropTypes.func,
};

export default pure(CustomerSegmentForm);
