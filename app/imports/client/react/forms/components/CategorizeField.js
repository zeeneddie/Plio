import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import { mapEntitiesToOptions, getEntityOptions, noop } from 'plio-util';

import { UserRoles } from '../../../../share/constants';
import { Composer } from '../../helpers';
import { CategorizeTypes } from '../../../../api/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { swal } from '../../../util';
import GroupSelect from './GroupSelect';

const CategorizeField = ({ organizationId, ...props }) => (
  <Composer
    components={[
      /* eslint-disable react/no-children-prop */
      <Mutation mutation={Mutations.CREATE_DEPARTMENT} children={noop} />,
      <Mutation mutation={Mutations.CREATE_PROJECT} children={noop} />,
      /* eslint-disable react/no-children-prop */
    ]}
  >
    {([createDepartment, createProject]) => (
      <GroupSelect
        {...props}
        loadOptions={query => query({
          query: Queries.CATEGORIZE_LIST,
          variables: { organizationId },
        }).then(({
          data: {
            departments: { departments },
            projects: { projects },
            user: { roles },
          },
        }) => {
          const canChangeOrgSettings = roles && roles.includes(UserRoles.CHANGE_ORG_SETTINGS);
          return ({
            options: [
              {
                label: 'Departments/teams',
                type: CategorizeTypes.DEPARTMENT,
                options: mapEntitiesToOptions(departments),
                button: canChangeOrgSettings ? {
                  label: inputValue => `Add department/team "${inputValue}"`,
                  onClick: ({ value }) => swal.promise({
                    title: 'Are you sure?',
                    text: `New department/team "${value}" will be added.`,
                    confirmButtonText: 'Add',
                    successTitle: 'Added!',
                    successText: `New department/team "${value}" was added successfully`,
                  }, () => createDepartment({
                    variables: {
                      input: {
                        organizationId,
                        name: value,
                      },
                    },
                    refetchQueries: [
                      {
                        query: Queries.CATEGORIZE_LIST,
                        variables: { organizationId },
                      },
                    ],
                  })).then(({ data: { createDepartment: { department } } }) =>
                    getEntityOptions(department)),
                } : null,
              },
              {
                label: 'Projects',
                type: CategorizeTypes.PROJECT,
                options: mapEntitiesToOptions(projects),
                button: canChangeOrgSettings ? {
                  label: inputValue => `Add project "${inputValue}"`,
                  onClick: ({ value }) => swal.promise({
                    title: 'Are you sure?',
                    text: `New project "${value}" will be added.`,
                    confirmButtonText: 'Add',
                    successTitle: 'Added!',
                    successText: `New project "${value}" was added successfully`,
                  }, () => createProject({
                    variables: {
                      input: {
                        organizationId,
                        title: value,
                      },
                    },
                    refetchQueries: [
                      {
                        query: Queries.CATEGORIZE_LIST,
                        variables: { organizationId },
                      },
                    ],
                  })).then(({ data: { createProject: { project } } }) =>
                    getEntityOptions(project)),
                } : null,
              },
            ],
          });
        }).catch(swal.error)}
      />
    )}
  </Composer>
);

CategorizeField.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default CategorizeField;
