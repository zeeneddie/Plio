import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import {
  getEntityOptions,
  getUserOptions,
  lenses,
  noop,
  convertDocumentOptions,
  getValues,
  mapUsersToOptions,
  getIds,
} from 'plio-util';
import { compose, pick, over, pathOr, repeat, defaultTo } from 'ramda';
import { pure, withHandlers } from 'recompose';
import diff from 'deep-diff';

import delayed from '../../helpers/delayed';
import { swal } from '../../../util';
import { CanvasTypes } from '../../../../share/constants';
import { ApolloFetchPolicies, OptionNone } from '../../../../api/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { validateValueProposition } from '../../../validation';
import { WithState, Composer } from '../../helpers';
import ValuePropositionForm from './ValuePropositionForm';
import CanvasModalGuidance from './CanvasModalGuidance';
import ValuePropositionSubcards from './ValuePropositionSubcards';
import {
  EntityModalNext,
  EntityModalHeader,
  EntityModalBody,
  EntityModalForm,
  RenderSwitch,
} from '../../components';

const getValueProposition = pathOr({}, repeat('valueProposition', 2));
const getInitialValues = compose(
  over(lenses.matchedTo, compose(defaultTo(OptionNone), getEntityOptions)),
  over(lenses.originator, getUserOptions),
  over(lenses.notify, mapUsersToOptions),
  over(lenses.lessons, getIds),
  over(lenses.files, defaultTo([])),
  pick([
    'originator',
    'title',
    'color',
    'matchedTo',
    'notes',
    'notify',
    'lessons',
  ]),
  getValueProposition,
);

const enhance = compose(
  withHandlers({
    refetchQueries: ({ _id, organizationId }) => () => [
      { query: Queries.VALUE_PROPOSITION_CARD, variables: { _id, organizationId } },
    ],
  }),
  pure,
);

const ValuePropositionEditModal = ({
  isOpen,
  toggle,
  organizationId,
  _id,
  refetchQueries,
}) => {
  const DelayedValuePropositionSubcards = delayed({
    loader: () => Promise.resolve(ValuePropositionSubcards),
    idle: true,
    delay: 250,
  });
  return (
    <WithState initialState={{ initialValues: {} }}>
      {({ state: { initialValues }, setState }) => (
        <Composer
          components={[
            /* eslint-disable react/no-children-prop */
            <Query
              query={Queries.VALUE_PROPOSITION_CARD}
              variables={{ _id, organizationId }}
              skip={!isOpen}
              onCompleted={data => setState({ initialValues: getInitialValues(data) })}
              fetchPolicy={ApolloFetchPolicies.CACHE_AND_NETWORK}
              children={noop}
            />,
            <Mutation mutation={Mutations.UPDATE_VALUE_PROPOSITION} children={noop} />,
            <Mutation mutation={Mutations.DELETE_VALUE_PROPOSITION} children={noop} />,
            <Mutation
              mutation={Mutations.MATCH_VALUE_PROPOSITION}
              refetchQueries={() => [{
                query: Queries.CUSTOMER_SEGMENTS,
                variables: { organizationId },
              }]}
              children={noop}
            />,
            /* eslint-disable react/no-children-prop */
          ]}
        >
          {([
            { data, ...query },
            updateValueProposition,
            deleteValueProposition,
            matchValueProposition,
          ]) => (
            <EntityModalNext
              {...{ isOpen, toggle }}
              isEditMode
              loading={query.loading}
              error={query.error}
              onDelete={() => {
                const { title } = getValueProposition(data);
                swal.promise(
                  {
                    text: `The value proposition "${title}" will be deleted`,
                    confirmButtonText: 'Delete',
                    successTitle: 'Deleted!',
                    successText: `The value proposition "${title}" was deleted successfully.`,
                  },
                  () => deleteValueProposition({
                    variables: { input: { _id } },
                    refetchQueries: [
                      { query: Queries.CANVAS_PAGE, variables: { organizationId } },
                    ],
                  }).then(toggle),
                );
              }}
            >
              <EntityModalForm
                {...{ initialValues }}
                validate={validateValueProposition}
                onSubmit={(values, form) => {
                  const currentValues = getInitialValues(data);
                  const difference = diff(values, currentValues);

                  if (!difference) return undefined;

                  const {
                    title,
                    originator,
                    color,
                    matchedTo,
                    notes = '',
                    notify = [],
                    files = [],
                  } = values;

                  if (difference[0].path[0] === 'matchedTo') {
                    return matchValueProposition({
                      variables: {
                        input: {
                          _id,
                          matchedTo: convertDocumentOptions({
                            documentType: CanvasTypes.CUSTOMER_SEGMENT,
                          }, matchedTo),
                        },
                      },
                    }).then(noop).catch((err) => {
                      form.reset(currentValues);
                      throw err;
                    });
                  }

                  return updateValueProposition({
                    variables: {
                      input: {
                        _id,
                        title,
                        notes,
                        color,
                        notify: getValues(notify),
                        fileIds: files,
                        originatorId: originator.value,
                      },
                    },
                  }).then(noop).catch((err) => {
                    form.reset(currentValues);
                    throw err;
                  });
                }}
              >
                {({ handleSubmit }) => (
                  <Fragment>
                    <EntityModalHeader label="Value proposition" />
                    <EntityModalBody>
                      <CanvasModalGuidance documentType={CanvasTypes.VALUE_PROPOSITION} />
                      <RenderSwitch
                        require={isOpen &&
                        data.valueProposition &&
                        data.valueProposition.valueProposition}
                        errorWhenMissing={noop}
                        loading={query.loading}
                        renderLoading={<ValuePropositionForm {...{ organizationId }} />}
                      >
                        {valueProposition => (
                          <Fragment>
                            <ValuePropositionForm
                              {...{ organizationId }}
                              matchedTo={valueProposition.matchedTo}
                              save={handleSubmit}
                            />
                            <DelayedValuePropositionSubcards
                              {...{ organizationId, valueProposition, refetchQueries }}
                              onChange={handleSubmit}
                              user={data && data.user}
                            />
                          </Fragment>
                        )}
                      </RenderSwitch>
                    </EntityModalBody>
                  </Fragment>
                )}
              </EntityModalForm>
            </EntityModalNext>
          )}
        </Composer>
      )}
    </WithState>
  );
};

ValuePropositionEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  _id: PropTypes.string,
  refetchQueries: PropTypes.func,
};

export default enhance(ValuePropositionEditModal);
