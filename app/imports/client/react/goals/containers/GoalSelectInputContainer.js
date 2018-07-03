import PropTypes from 'prop-types';
import { mapEntitiesToOptions } from 'plio-util';
import { withHandlers, setPropTypes, defaultProps, componentFromProp } from 'recompose';

import { namedCompose } from '../../helpers';
import { SelectInput } from '../../components';
import { Query } from '../../../graphql';
import { client } from '../../../apollo';

export default namedCompose('GoalSelectInputContainer')(
  setPropTypes({
    organizationId: PropTypes.string.isRequired,
  }),
  defaultProps({
    component: SelectInput,
    loadOptionsOnOpen: true,
  }),
  withHandlers({
    loadOptions: ({ organizationId }) => () => client.query({
      query: Query.GOAL_LIST,
      variables: { organizationId },
    }).then(({ data: { goals: { goals } } }) => ({
      options: mapEntitiesToOptions(goals),
    })),
  }),
)(componentFromProp('component'));
