import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import {
  getUserOptions,
  lenses,
  noop,
  mapUsersToOptions,
  getValues,
  getIds,
} from 'plio-util';
import { compose, pick, over, pathOr, repeat, defaultTo } from 'ramda';
import { pure, withHandlers } from 'recompose';
import diff from 'deep-diff';

import { swal } from '../../../util';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { AWSDirectives, CanvasTypes } from '../../../../share/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { validateChannel } from '../../../validation';
import { WithState, Composer } from '../../helpers';
import CanvasForm from './CanvasForm';
import CanvasModalGuidance from './CanvasModalGuidance';
import DelayedCanvasSubcards from './DelayedCanvasSubcards';
import {
  EntityModalNext,
  EntityModalHeader,
  EntityModalBody,
  EntityModalForm,
  RenderSwitch,
} from '../../components';

const getChannel = pathOr({}, repeat('channel', 2));
const getInitialValues = compose(
  over(lenses.originator, getUserOptions),
  over(lenses.notify, mapUsersToOptions),
  over(lenses.lessons, getIds),
  over(lenses.files, defaultTo([])),
  pick([
    'originator',
    'title',
    'color',
    'notes',
    'notify',
    'lessons',
  ]),
  getChannel,
);

const enhance = compose(
  withHandlers({
    refetchQueries: ({ _id, organizationId }) => () => [
      { query: Queries.CHANNEL_CARD, variables: { _id, organizationId } },
    ],
  }),
  pure,
);

const ChannelEditModal = ({
  isOpen,
  toggle,
  organizationId,
  _id,
  refetchQueries,
}) => (
  <WithState initialState={{ initialValues: {} }}>
    {({ state: { initialValues }, setState }) => (
      <Composer
        components={[
          /* eslint-disable react/no-children-prop */
          <Query
            query={Queries.CHANNEL_CARD}
            variables={{ _id, organizationId }}
            skip={!isOpen}
            onCompleted={data => setState({ initialValues: getInitialValues(data) })}
            fetchPolicy={ApolloFetchPolicies.CACHE_AND_NETWORK}
            children={noop}
          />,
          <Mutation mutation={Mutations.UPDATE_CHANNEL} children={noop} />,
          <Mutation mutation={Mutations.DELETE_CHANNEL} children={noop} />,
          /* eslint-disable react/no-children-prop */
        ]}
      >
        {([{ data, ...query }, updateChannel, deleteChannel]) => (
          <EntityModalNext
            {...{ isOpen, toggle }}
            isEditMode
            loading={query.loading}
            error={query.error}
            onDelete={() => {
              const { title } = getChannel(data);
              swal.promise(
                {
                  text: `The channel "${title}" will be deleted`,
                  confirmButtonText: 'Delete',
                  successTitle: 'Deleted!',
                  successText: `The channel "${title}" was deleted successfully.`,
                },
                () => deleteChannel({
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
              validate={validateChannel}
              onSubmit={(values, form) => {
                const currentValues = getInitialValues(data);
                const isDirty = diff(values, currentValues);

                if (!isDirty) return undefined;

                const {
                  title,
                  originator,
                  color,
                  notes = '',
                  notify = [],
                  files = [],
                } = values;

                return updateChannel({
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
                  <EntityModalHeader label="Channel" />
                  <EntityModalBody>
                    <CanvasModalGuidance documentType={CanvasTypes.CHANNEL} />
                    <RenderSwitch
                      require={isOpen && data.channel && data.channel.channel}
                      errorWhenMissing={noop}
                      loading={query.loading}
                      renderLoading={<CanvasForm {...{ organizationId }} />}
                    >
                      {channel => (
                        <Fragment>
                          <CanvasForm {...{ organizationId }} save={handleSubmit} />
                          <DelayedCanvasSubcards
                            {...{ organizationId, refetchQueries }}
                            section={channel}
                            onChange={handleSubmit}
                            documentType={CanvasTypes.CHANNEL}
                            slingshotDirective={AWSDirectives.CHANNEL_FILES}
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

ChannelEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  _id: PropTypes.string,
  refetchQueries: PropTypes.func,
};

export default enhance(ChannelEditModal);
