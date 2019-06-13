import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Query, Mutation } from 'react-apollo';
import { compose, pick, over, pathOr, repeat, path } from 'ramda';
import {
  getUserOptions,
  lenses,
  noop,
  getValues,
  mapUsersToOptions,
  getIds,
} from 'plio-util';
import { pure, withHandlers } from 'recompose';
import diff from 'deep-diff';

import { swal } from '../../../util';
import { AWSDirectives, CanvasTypes } from '../../../../share/constants';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { validateKeyPartner } from '../../../validation';
import {
  EntityModalNext,
  EntityModalHeader,
  EntityModalBody,
  EntityModalForm,
  RenderSwitch,
} from '../../components';
import { WithState, Composer } from '../../helpers';
import KeyPartnerForm from './KeyPartnerForm';
import ModalGuidancePanel from '../../guidance/components/ModalGuidancePanel';
import CanvasSubcards from './CanvasSubcards';
import KeyPartnersHelp from './KeyPartnersHelp';

const keyPartnerPath = repeat('keyPartner', 2);
const getKeyPartner = path(keyPartnerPath);
const getInitialValues = compose(
  over(lenses.originator, getUserOptions),
  over(lenses.notify, mapUsersToOptions),
  over(lenses.lessons, getIds),
  over(lenses.files, getIds),
  pick([
    'originator',
    'title',
    'color',
    'criticality',
    'levelOfSpend',
    'notes',
    'notify',
    'lessons',
    'files',
  ]),
  pathOr({}, keyPartnerPath),
);

const enhance = compose(
  withHandlers({
    refetchQueries: ({ _id, organizationId }) => () => [
      {
        query: Queries.KEY_PARTNER_CARD,
        variables: { _id, organizationId },
      },
    ],
  }),
  pure,
);

const KeyPartnerEditModal = ({
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
            query={Queries.KEY_PARTNER_CARD}
            variables={{ _id, organizationId }}
            skip={!isOpen}
            onCompleted={data => setState({ initialValues: getInitialValues(data) })}
            fetchPolicy={ApolloFetchPolicies.CACHE_AND_NETWORK}
            children={noop}
          />,
          <Mutation mutation={Mutations.UPDATE_KEY_PARTNER} children={noop} />,
          <Mutation mutation={Mutations.DELETE_KEY_PARTNER} children={noop} />,
          /* eslint-disable react/no-children-prop */
        ]}
      >
        {([{ data, ...query }, updateKeyPartner, deleteKeyPartner]) => {
          const keyPartner = getKeyPartner(data);
          return (
            <EntityModalNext
              {...{ isOpen, toggle }}
              isEditMode
              loading={query.loading}
              error={query.error}
              onDelete={() => {
                const { title } = keyPartner || {};
                swal.promise(
                  {
                    text: `The key partner "${title}" will be deleted`,
                    confirmButtonText: 'Delete',
                    successTitle: 'Deleted!',
                    successText: `The key partner "${title}" was deleted successfully.`,
                  },
                  () => deleteKeyPartner({
                    variables: { input: { _id } },
                  }).then(toggle),
                );
              }}
            >
              <EntityModalForm
                {...{ initialValues }}
                validate={validateKeyPartner}
                onSubmit={(values, form) => {
                  const currentValues = getInitialValues(data);
                  const isDirty = diff(values, currentValues);

                  if (!isDirty) return undefined;

                  const {
                    title,
                    originator,
                    color,
                    criticality,
                    levelOfSpend,
                    notes = '', // final form sends undefined value instead of an empty string
                    notify = [],
                    files = [],
                  } = values;

                  return updateKeyPartner({
                    variables: {
                      input: {
                        _id,
                        title,
                        notes,
                        color,
                        criticality,
                        levelOfSpend,
                        fileIds: files,
                        notify: getValues(notify),
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
                    <EntityModalHeader label="Key partner" />
                    <EntityModalBody>
                      <ModalGuidancePanel documentType={CanvasTypes.KEY_PARTNER}>
                        <KeyPartnersHelp />
                      </ModalGuidancePanel>
                      <RenderSwitch
                        require={isOpen && !query.loading && keyPartner}
                        errorWhenMissing={noop}
                        loading={query.loading}
                        renderLoading={(
                          <fieldset disabled>
                            <KeyPartnerForm {...{ organizationId }} />
                          </fieldset>
                        )}
                      >
                        {() => (
                          <Fragment>
                            <KeyPartnerForm {...{ organizationId }} save={handleSubmit} />
                            <CanvasSubcards
                              {...{ organizationId, refetchQueries }}
                              section={keyPartner}
                              onChange={handleSubmit}
                              refetchQuery={Queries.KEY_PARTNER_CARD}
                              documentType={CanvasTypes.KEY_PARTNER}
                              slingshotDirective={AWSDirectives.KEY_PARTNER_FILES}
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
          );
        }}
      </Composer>
    )}
  </WithState>
);

KeyPartnerEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
  _id: PropTypes.string,
  refetchQueries: PropTypes.func,
};

export default enhance(KeyPartnerEditModal);
