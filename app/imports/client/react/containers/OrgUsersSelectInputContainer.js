import PropTypes from 'prop-types';
import { mapUsersToOptions } from 'plio-util';
import { withHandlers, setPropTypes, defaultProps, componentFromProp } from 'recompose';
import { compose, pluck } from 'ramda';

import { namedCompose } from '../helpers';
import SelectInput from '../forms/components/SelectInput';
import { Query } from '../../graphql';
import { client } from '../../apollo';

export default namedCompose('OrgUsersSelectInputContainer')(
  setPropTypes({ organizationId: PropTypes.string.isRequired }),
  defaultProps({
    component: SelectInput,
    loadOptionsOnOpen: true,
  }),
  withHandlers({
    loadOptions: ({ organizationId }) => () => client.query({
      query: Query.ORGANIZATION_USERS,
      variables: { organizationId },
    }).then(({ data: { organization: { users } } }) => ({
      options: compose(mapUsersToOptions, pluck('user'))(users),
    })),
  }),
)(componentFromProp('component'));

