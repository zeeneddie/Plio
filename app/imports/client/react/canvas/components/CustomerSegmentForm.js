import PropTypes from 'prop-types';
import React from 'react';
import { getEntityOptions, mapEntitiesToOptions } from 'plio-util';

import { Query } from '../../../graphql';
import CanvasForm from './CanvasForm';
import { FormField, PercentInputField, GroupSelect } from '../../components';
import { OptionNone } from '../../../../api/constants';

const CustomerSegmentForm = ({
  organizationId,
  matchedTo,
  save,
}) => (
  <CanvasForm {...{ organizationId, save }}>
    <FormField>
      Matched to
      <GroupSelect
        name="matchedTo"
        placeholder="Matched to"
        multi={false}
        onChange={save}
        loadOptions={query => query({
          query: Query.VALUE_PROPOSITION_LIST,
          variables: { organizationId, isUnmatched: true },
        })}
        transformOptions={({ data: { valuePropositions: { valuePropositions } } }) => {
          const options = [];

          if (matchedTo) options.push(getEntityOptions(matchedTo));

          options.push(...mapEntitiesToOptions(valuePropositions));

          return {
            options: [
              {
                label: 'Unmatched value propositions:',
                options,
              },
              {
                label: '(Each customer segment can only be matched to 1 value proposition)',
                options: [OptionNone],
              },
            ],
          };
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

export default React.memo(CustomerSegmentForm);
