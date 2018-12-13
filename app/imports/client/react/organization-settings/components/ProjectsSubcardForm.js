import React from 'react';
import PropTypes from 'prop-types';
import { mapEntitiesToOptions, noop } from 'plio-util';
import { Query, Mutation } from 'react-apollo';
import { pure } from 'recompose';

import { Composer } from '../../helpers';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { swal } from '../../../util';
import { EntityArrayForm, RenderSwitch, Preloader } from '../../components';

const getRefetchQueries = organizationId => () => [
  { query: Queries.PROJECT_LIST, variables: { organizationId } },
  { query: Queries.PROJECT_COUNT, variables: { organizationId } },
];

const ProjectsSubcardForm = ({ organizationId, isOpen }) => (
  <Composer
    components={[
      /* eslint-disable react/no-children-prop */
      <Query
        query={Queries.PROJECT_LIST}
        variables={{ organizationId }}
        skip={!isOpen}
        onError={swal.error}
        children={noop}
      />,
      <Mutation
        mutation={Mutations.CREATE_PROJECT}
        refetchQueries={getRefetchQueries(organizationId)}
        children={noop}
      />,
      <Mutation
        mutation={Mutations.DELETE_PROJECT}
        refetchQueries={getRefetchQueries(organizationId)}
        children={noop}
      />,
      <Mutation mutation={Mutations.UPDATE_PROJECT} children={noop} />,
      /* eslint-disable react/no-children-prop */
    ]}
  >
    {([
      { data, loading },
      createProject,
      deleteProject,
      updateProject,
    ]) => (
      <RenderSwitch
        {...{ loading }}
        require={data && data.projects && data.projects.projects}
        errorWhenMissing={noop}
        renderLoading={<Preloader size="2" tag="div" center />}
      >
        {projects => (
          <EntityArrayForm
            items={mapEntitiesToOptions(projects)}
            placeholder="Another project"
            buttonLabel="Add project"
            onCreate={({ label }) => createProject({
              variables: {
                input: {
                  title: label,
                  organizationId,
                },
              },
            })}
            onUpdate={({ value, label }) => updateProject({
              variables: {
                input: {
                  _id: value,
                  title: label,
                },
              },
            })}
            onDelete={({ value, label }) => swal.promise({
              text: `Project "${label}" will be removed.`,
              confirmButtonText: 'Remove',
              successTitle: 'Removed!',
              successText: `Project "${label}" was removed successfully.`,
            }, () => deleteProject({
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

ProjectsSubcardForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default pure(ProjectsSubcardForm);
