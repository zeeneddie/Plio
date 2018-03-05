import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { mapEntitiesToOptions } from 'plio-util';
import { setPropTypes, compose } from 'recompose';

import { Query } from '../../../../client/graphql';
import SelectInput from '../../forms/components/SelectInput';

export default compose(
  setPropTypes({
    organizationId: PropTypes.string.isRequired,
  }),
  graphql(Query.GOAL_LIST, {
    options: ({ organizationId }) => ({
      variables: { organizationId },
    }),
    props: ({
      ownProps: {
        organizationId,
        ...props
      },
      data: {
        loading,
        goals: {
          goals = [],
        } = {},
      },
    }) => ({
      isLoading: loading,
      options: mapEntitiesToOptions(goals),
      ...props,
    }),
  }),
)(SelectInput);
