import React from 'react';
import PropTypes from 'prop-types';
import { compose, sort, map } from 'ramda';
import { byTitle } from 'plio-util';

import { ApolloSelectInputField } from '../../components';
import { Query } from '../../../graphql';

const getOptions = compose(
  map(({ _id, title, abbreviation }) => ({
    label: `${title}${abbreviation ? ` (${abbreviation})` : ''}`,
    value: _id,
  })),
  sort(byTitle),
);

const StandardTypeSelectInput = ({ organizationId, ...props }) => (
  <ApolloSelectInputField
    {...props}
    loadOptions={query => query({
      query: Query.STANDARD_TYPE_LIST,
      variables: { organizationId },
    })}
    transformOptions={({ data: { standardTypes: { standardTypes } } }) => getOptions(standardTypes)}
  />
);

StandardTypeSelectInput.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default StandardTypeSelectInput;
