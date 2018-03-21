import PropTypes from 'prop-types';
import { mapUsersToOptions } from 'plio-util';
import { withHandlers, setPropTypes, defaultProps, componentFromProp } from 'recompose';

import { namedCompose } from '../helpers';
import SelectInput from '../forms/components/SelectInput';
import { Query } from '../../../client/graphql';
import { client } from '../../../client/apollo';

export default namedCompose('OrgUsersSelectInputContainer')(
  setPropTypes({ organizationId: PropTypes.string.isRequired }),
  defaultProps({
    component: SelectInput,
    loadOptionsOnFocus: true,
  }),
  withHandlers({
    loadOptions: ({ organizationId }) => () => client.query({
      query: Query.ORGANIZATION_USERS,
      variables: { organizationId },
    }).then(({ data: { organization: { users } } }) => ({
      options: mapUsersToOptions(users),
    })),
  }),
)(componentFromProp('component'));

