import PropTypes from 'prop-types';
import { mapEntitiesToOptions } from 'plio-util';
import { withHandlers, setPropTypes, defaultProps, componentFromProp } from 'recompose';

import { namedCompose } from '../helpers';
import { SelectInput } from '../components';
import { Query } from '../../../client/graphql';
import { client } from '../../../client/apollo';

export default namedCompose('DepartmentsSelectInputContainer')(
  setPropTypes({ organizationId: PropTypes.string.isRequired }),
  defaultProps({
    component: SelectInput,
    loadOptionsOnFocus: true,
    backspaceRemoves: false,
  }),
  withHandlers({
    loadOptions: ({ organizationId }) => () => client.query({
      query: Query.DEPARTMENT_LIST,
      variables: { organizationId },
    }).then(({ data: { departments: { departments } } }) => ({
      options: mapEntitiesToOptions(departments),
    })),
  }),
)(componentFromProp('component'));
