import React from 'react';
import PropTypes from 'prop-types';
import { mapEntitiesToOptions } from 'plio-util';

import { Query } from '../../../graphql';
import { swal } from '../../../util';

import ApolloSelectInputField from './ApolloSelectInputField';

const DepartmentSelectInput = ({
  organizationId,
  ...props
}) => (
  <ApolloSelectInputField
    {...props}
    loadOptions={query => query({
      query: Query.DEPARTMENT_LIST,
      variables: { organizationId },
    }).then(({ data: { departments: { departments } } }) => ({
      options: mapEntitiesToOptions(departments),
    })).catch(swal.error)}
  />
);

DepartmentSelectInput.defaultProps = {
  multi: true,
  type: 'creatable',
  promptTextCreator: value => `Add "${value}" department/sector`,
};

DepartmentSelectInput.propTypes = {
  organizationId: PropTypes.string.isRequired,
  multi: PropTypes.bool,
  promptTextCreator: PropTypes.func,
  type: PropTypes.string,
};

export default DepartmentSelectInput;
