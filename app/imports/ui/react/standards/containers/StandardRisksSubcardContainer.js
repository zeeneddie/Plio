import { connect } from 'react-redux';
import { withHandlers, withProps } from 'recompose';
import { view, ifElse, compose } from 'ramda';
import { lenses, viewEq, getUserOptions } from 'plio-util';
import { graphql } from 'react-apollo';

import { namedCompose, withStore, withApollo } from '../../helpers';
import { ProblemMagnitudes } from '../../../../share/constants';
import {
  getRiskTypes,
  getCurrentUser,
  getOrganizationId,
  getRiskGuidelines,
} from '../../../../client/store/selectors';
import { getRisksLinkedToStandard } from '../../../../client/store/selectors/risks';
import { Mutation } from '../../../../client/graphql';
import { swal } from '../../../../client/util';
import RisksSubcard from '../../risks/components/RisksSubcard';
import { getUserWithFullName } from '../../../../api/users/helpers';

const getCurrentUserWithFullName = compose(getUserWithFullName, getCurrentUser);

export default namedCompose('StandardRisksSubcardContainer')(
  withStore,
  withApollo,
  connect((state, { standardId }) => ({
    organizationId: getOrganizationId(state),
    risks: getRisksLinkedToStandard(state, { standardId }),
    linkedTo: state.collections.standardsByIds[standardId],
    riskTypes: getRiskTypes(state),
    guidelines: getRiskGuidelines(state),
    user: getCurrentUserWithFullName(state),
  })),
  graphql(Mutation.LINK_STANDARD_TO_RISK, {
    props: ({
      mutate,
      ownProps: {
        linkedTo,
      },
    }) => ({
      linkStandardToRisk: async ({ risk: { value: riskId } = {} }) => {
        if (!riskId) throw new Error('Risk is required');

        return mutate({
          variables: {
            input: {
              _id: riskId,
              standardId: linkedTo._id,
            },
          },
        });
      },
    }),
  }),
  graphql(Mutation.CREATE_RISK, {
    props: ({
      mutate,
      ownProps: {
        organizationId,
        linkedTo,
      },
    }) => ({
      createRisk: async ({
        title,
        description,
        magnitude,
        originator: { value: originatorId },
        owner: { value: ownerId },
        type: typeId,
      }) => {
        if (!title) throw new Error('Title is required');

        return mutate({
          variables: {
            input: {
              title,
              description,
              originatorId,
              ownerId,
              magnitude,
              typeId,
              organizationId,
              standardsIds: [linkedTo._id],
            },
          },
        });
      },
    }),
  }),
  withHandlers({
    onSave: ({ linkStandardToRisk, createRisk }) => ifElse(
      viewEq(0, lenses.active),
      createRisk,
      linkStandardToRisk,
    ),
  }),
  graphql(Mutation.DELETE_RISK, {
    props: ({ mutate }) => ({
      onDelete: (e, {
        entity: { _id, title },
      }) => swal.promise({
        text: `The risk "${title}" will be deleted`,
        confirmButtonText: 'Delete',
        successTitle: 'Deleted!',
        successText: `The risk "${title}" was deleted successfully.`,
      }, () => mutate({
        variables: {
          input: { _id },
        },
      })),
    }),
  }),
  withProps(({ user, riskTypes }) => ({
    initialValues: {
      active: 0,
      owner: getUserOptions(user),
      originator: getUserOptions(user),
      type: view(lenses.head._id, riskTypes),
      magnitude: ProblemMagnitudes.MAJOR,
    },
  })),
)(RisksSubcard);
