import PropTypes from 'prop-types';
import React from 'react';
import { Meteor } from 'meteor/meteor';
import {
  pick,
  compose,
  over,
  unless,
  isNil,
  pathOr,
  repeat,
} from 'ramda';
import { Query, Mutation } from 'react-apollo';
import {
  getUserOptions,
  getEntityOptions,
  lenses,
  noop,
  mapEntitiesToOptions,
  getValues,
} from 'plio-util';
import diff from 'deep-diff';

import { ApolloFetchPolicies } from '../../../../api/constants';
import { DocumentTypes } from '../../../../share/constants';
import { composeWithTracker, swal } from '../../../util';
import { Composer, WithState, renderComponent } from '../../helpers';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';

const getSourceInitialValue = unless(isNil, pick(['type', 'fileId', 'url']));
const getStandard = pathOr({}, repeat('standard', 2));

const getInitialValues = compose(
  over(lenses.projects, mapEntitiesToOptions),
  over(lenses.departments, mapEntitiesToOptions),
  over(lenses.owner, getUserOptions),
  over(lenses.section, getEntityOptions),
  over(lenses.type, getEntityOptions),
  over(lenses.source1, getSourceInitialValue),
  over(lenses.source2, getSourceInitialValue),
  pick([
    'title',
    'owner',
    'status',
    'section',
    'type',
    'source1',
    'source2',
    'description',
    'issueNumber',
    'uniqueNumber',
    'departments',
    'projects',
    'issueComments',
  ]),
);

const enhance = composeWithTracker(
  ({ standard, standardId, isOpen }, onData) => {
    if (isOpen) {
      Meteor.subscribe(
        'sourceFilesByDocument',
        { _id: standard && standard._id || standardId, documentType: DocumentTypes.STANDARD },
        { onStop: error => error && swal.error(error, 'Files subscription error') },
      );
    }
    onData(null, {});
  },
  { propsToWatch: ['isOpen'] },
);

const StandardEditContainer = ({
  standard: _standard = null,
  standardId,
  organizationId,
  isOpen,
  toggle,
  onDelete,
  fetchPolicy = ApolloFetchPolicies.CACHE_AND_NETWORK,
  ...props
}) => (
  <WithState
    initialState={{
      standard: _standard,
      initialValues: unless(isNil, getInitialValues, _standard),
    }}
  >
    {({ state: { initialValues, standard }, setState }) => (
      <Composer
        components={[
          /* eslint-disable react/no-children-prop */
          <Query
            {...{ fetchPolicy }}
            query={Queries.STANDARD_CARD}
            variables={{ _id: standardId }}
            skip={!isOpen || !!_standard}
            onCompleted={data => setState({
              initialValues: getInitialValues(getStandard(data)),
              standard: getStandard(data),
            })}
            children={noop}
          />,
          <Mutation
            mutation={Mutations.UPDATE_STANDARD}
            onCompleted={({ updateStandard }) => setState({ standard: updateStandard })}
            children={noop}
          />,
          <Mutation
            mutation={Mutations.DELETE_STANDARD}
            refetchQueries={() => [
              { query: Queries.STANDARD_LIST, variables: { organizationId } },
              { query: Queries.CANVAS_PAGE, variables: { organizationId } },
            ]}
            children={noop}
          />,
          /* eslint-enable react/no-children-prop */
        ]}
      >
        {([
          { loading, error },
          updateStandard,
          deleteStandard,
        ]) => renderComponent({
          ...props,
          loading,
          error,
          organizationId,
          isOpen,
          toggle,
          standard,
          initialValues,
          onSubmit: async (values, form) => {
            const currentValues = getInitialValues(standard);
            const difference = diff(values, currentValues);

            if (!difference) return undefined;

            const {
              title,
              status,
              description = '',
              issueNumber,
              issueComments = '',
              uniqueNumber,
              source1,
              source2,
              departments,
              projects,
              section: { value: sectionId } = {},
              type: { value: typeId } = {},
              owner: { value: owner } = {},
            } = values;

            return updateStandard({
              variables: {
                input: {
                  _id: standard._id,
                  departmentsIds: getValues(departments),
                  projectIds: getValues(projects),
                  source1,
                  source2,
                  title,
                  status,
                  sectionId,
                  typeId,
                  owner,
                  description,
                  issueComments,
                  issueNumber,
                  uniqueNumber,
                },
              },
            }).then(noop).catch((err) => {
              form.reset(currentValues);
              throw err;
            });
          },
          onDelete: () => {
            if (onDelete) return onDelete();
            return swal.promise({
              text: `The standard "${standard.title}" will be deleted`,
              confirmButtonText: 'Delete',
              successTitle: 'Deleted!',
              successText: `The standard "${standard.title}" was deleted successfully.`,
            }, () => deleteStandard({
              variables: {
                input: {
                  _id: standard._id,
                },
              },
            }).then(toggle));
          },
        })}
      </Composer>
    )}
  </WithState>
);

StandardEditContainer.propTypes = {
  organizationId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  standard: PropTypes.object,
  onDelete: PropTypes.func,
  standardId: PropTypes.string,
  fetchPolicy: PropTypes.string,
};

export default React.memo(enhance(StandardEditContainer));
