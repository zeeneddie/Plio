import React from 'react';
import PropTypes from 'prop-types';
import { compose, sort, map } from 'ramda';
import { byTitle } from 'plio-util';

import { swal } from '../../../util';
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
    }).then(({
      data: {
        standardTypes: {
          standardTypes,
        },
      },
    }) => ({
      options: getOptions(standardTypes),
    })).catch(swal.error)}
  />
);

StandardTypeSelectInput.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default StandardTypeSelectInput;
