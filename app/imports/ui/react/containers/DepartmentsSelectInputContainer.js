import PropTypes from 'prop-types';
import { mapEntitiesToOptions } from 'plio-util';
import { withHandlers, setPropTypes, defaultProps, componentFromProp, withProps } from 'recompose';

import { namedCompose } from '../helpers';
import { SelectInput } from '../components';
import { Query } from '../../../client/graphql';
import { client } from '../../../client/apollo';

export default namedCompose('DepartmentsSelectInputContainer')(
  setPropTypes({ organizationId: PropTypes.string.isRequired }),
  defaultProps({
    component: SelectInput,
    loadOptionsOnOpen: true,
    multi: true,
    promptTextCreator: value => `Add "${value}" department/sector`,
  }),
  withProps(({ onNewOptionClick, type }) => ({
    type: type || onNewOptionClick ? 'creatable' : undefined,
  })),
  withHandlers({
    loadOptions: ({ organizationId }) => () => client.query({
      query: Query.DEPARTMENT_LIST,
      variables: { organizationId },
    }).then(({ data: { departments: { departments } } }) => ({
      options: mapEntitiesToOptions(departments),
    })),
  }),
)(componentFromProp('component'));
