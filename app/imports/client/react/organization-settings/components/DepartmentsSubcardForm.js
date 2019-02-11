import React from 'react';
import PropTypes from 'prop-types';
import { mapEntitiesToOptions, noop, byTitle } from 'plio-util';
import { Query, Mutation } from 'react-apollo';
import { sort } from 'ramda';

import { Composer } from '../../helpers';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { swal } from '../../../util';
import { EntityArrayForm, RenderSwitch, Preloader } from '../../components';

const getRefetchQueries = organizationId => () => [
  { query: Queries.DEPARTMENT_LIST, variables: { organizationId } },
  { query: Queries.DEPARTMENT_COUNT, variables: { organizationId } },
];

const DepartmentsSubcardForm = ({ organizationId, isOpen }) => (
  <Composer
    components={[
      /* eslint-disable react/no-children-prop */
      <Query
        query={Queries.DEPARTMENT_LIST}
        variables={{ organizationId }}
        skip={!isOpen}
        onError={swal.error}
        children={noop}
      />,
      <Mutation
        mutation={Mutations.CREATE_DEPARTMENT}
        refetchQueries={getRefetchQueries(organizationId)}
        children={noop}
      />,
      <Mutation
        mutation={Mutations.DELETE_DEPARTMENT}
        refetchQueries={getRefetchQueries(organizationId)}
        children={noop}
      />,
      <Mutation mutation={Mutations.UPDATE_DEPARTMENT} children={noop} />,
      /* eslint-disable react/no-children-prop */
    ]}
  >
    {([
      { data, loading },
      createDepartment,
      deleteDepartment,
      updateDepartment,
    ]) => (
      <RenderSwitch
        {...{ loading }}
        require={data && data.departments && data.departments.departments}
        errorWhenMissing={noop}
        renderLoading={<Preloader size="2" tag="div" center />}
      >
        {departments => (
          <EntityArrayForm
            items={mapEntitiesToOptions(sort(byTitle, departments))}
            placeholder="Another department/team"
            buttonLabel="Add department/team"
            onCreate={({ label }) => createDepartment({
              variables: {
                input: {
                  name: label,
                  organizationId,
                },
              },
            })}
            onUpdate={({ value, label }) => updateDepartment({
              variables: {
                input: {
                  _id: value,
                  name: label,
                },
              },
            })}
            onDelete={({ value, label }) => swal.promise({
              text: `Department/team "${label}" will be removed.`,
              confirmButtonText: 'Remove',
              successTitle: 'Removed!',
              successText: `Department/team "${label}" was removed successfully.`,
            }, () => deleteDepartment({
              variables: {
                input: { _id: value },
              },
            }))}
          />
        )}
      </RenderSwitch>
    )}
  </Composer>
);

DepartmentsSubcardForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default React.memo(DepartmentsSubcardForm);
