import { Meteor } from 'meteor/meteor';
import { defaultProps, withHandlers } from 'recompose';
import { graphql } from 'react-apollo';
import { complement, eqProps, pluck } from 'ramda';
import { connect } from 'react-redux';

import { DocumentTypes, AWSDirectives } from '../../../../share/constants';
import { Files } from '../../../../share/collections';
import { Mutation } from '../../../../client/graphql';
import { namedCompose } from '../../helpers';
import { FilesSubcard } from '../../components';
import { composeWithTracker } from '../../../../client/util';
import { setError } from '../../components/Modal';

const { LINK_FILE_TO_GOAL, UNLINK_FILE_FROM_GOAL } = Mutation;

export default namedCompose('GoalFilesSubcardContainer')(
  defaultProps({ slingshotDirective: AWSDirectives.GOAL_FILES }),
  graphql(LINK_FILE_TO_GOAL, { name: LINK_FILE_TO_GOAL.name }),
  graphql(UNLINK_FILE_FROM_GOAL, { name: UNLINK_FILE_FROM_GOAL.name }),
  withHandlers({
    onAfterInsert: ({ goalId: _id, [LINK_FILE_TO_GOAL.name]: mutate }) => fileId => mutate({
      variables: {
        input: {
          _id,
          fileId,
        },
      },
    }),
    onAfterRemove: ({
      goalId: _id,
      [UNLINK_FILE_FROM_GOAL.name]: mutate,
    }) => ({ _id: fileId }) => mutate({
      variables: {
        input: {
          _id,
          fileId,
        },
      },
    }),
  }),
  connect(),
  composeWithTracker(
    ({ goalId, organizationId, dispatch }, onData) => {
      const uploaderMetaContext = { organizationId, goalId };
      const args = { _id: goalId, documentType: DocumentTypes.GOAL };
      const subscription = Meteor.subscribe('filesByDocument', args, {
        onStop: ({ error } = {}) =>
          error && dispatch(setError(`Files subscription error: ${error}`)),
      });

      if (subscription.ready()) {
        const files = Files.find({ organizationId }).fetch();
        const fileIds = pluck('_id', files);

        onData(null, { fileIds, uploaderMetaContext });
      }
    },
    {
      propsToWatch: ['goalId', 'organizationId'],
      shouldSubscribe: complement(eqProps)('goalId'),
    },
  ),
)(FilesSubcard);
