import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import { mapUsersToOptions, lenses } from 'plio-util';
import { setPropTypes } from 'recompose';
import { view } from 'ramda';

import { namedCompose, withPreloader, omitProps } from '../helpers';
import { SelectInput } from '../components';
import { Query } from '../../../client/graphql';

export default namedCompose('OrgUsersSelectInputContainer')(
  setPropTypes({
    organizationId: PropTypes.string.isRequired,
  }),
  graphql(Query.ORGANIZATION_USERS, {
    options: ({ organizationId }) => ({
      variables: { organizationId },
    }),
    props: ({
      ownProps: {
        onError,
        organizationId,
        ...props
      },
      data: {
        loading,
        error,
        organization: {
          users = [],
        } = {},
      },
    }) => {
      if (error && onError) onError(error);

      return {
        loading,
        items: mapUsersToOptions(users),
        ...props,
      };
    },
  }),
  withPreloader(view(lenses.loading), () => ({ size: 1 })),
  omitProps(['loading']),
)(SelectInput);
