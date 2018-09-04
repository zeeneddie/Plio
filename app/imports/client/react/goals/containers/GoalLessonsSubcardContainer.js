import { pure } from 'recompose';
import moment from 'moment';
import { graphql } from 'react-apollo';
import { Cache, toDate, getUserOptions, bySerialNumber } from 'plio-util';
import { sort } from 'ramda';

import { namedCompose } from '../../helpers';
import { LessonsSubcard } from '../../lessons';
import { Mutation, Fragment, Query } from '../../../graphql';
import { DocumentTypes } from '../../../../share/constants';
import { updateGoalFragment } from '../../../apollo/utils';
import { swal } from '../../../util';
import { ApolloFetchPolicies } from '../../../../api/constants';

export default namedCompose('GoalLessonsSubcardContainer')(
  pure,
  graphql(Query.GOAL_LESSONS_CARD, {
    options: ({ goalId }) => ({
      variables: { _id: goalId },
      fetchPolicy: ApolloFetchPolicies.CACHE_ONLY,
    }),
    props: ({
      data: {
        user,
        goal: {
          goal: {
            _id,
            title,
            sequentialId,
            lessons = [],
            organization: { _id: organizationId } = {},
          },
        } = {},
      },
    }) => ({
      organizationId,
      lessons: sort(bySerialNumber, lessons),
      linkedTo: {
        _id,
        title,
        sequentialId,
      },
      initialValues: {
        owner: getUserOptions(user),
        date: moment(),
      },
    }),
  }),
  graphql(Mutation.CREATE_LESSON, {
    props: ({
      mutate,
      ownProps: {
        linkedTo,
        organizationId,
      },
    }) => ({
      onSave: async ({
        title,
        date,
        notes,
        owner: { value: owner } = {},
      }) => {
        const errors = [];

        if (!title) errors.push('Title is required');
        if (!notes) errors.push('Notes are required');

        if (errors.length) throw new Error(errors.join('\n'));

        return mutate({
          variables: {
            input: {
              title,
              owner,
              notes,
              organizationId,
              date: toDate(date),
              linkedTo: {
                documentId: linkedTo._id,
                documentType: DocumentTypes.GOAL,
              },
            },
          },
          update: (proxy, { data: { createLesson: { lesson } } }) => updateGoalFragment(
            Cache.addLesson(lesson),
            {
              id: linkedTo._id,
              fragment: Fragment.GOAL_CARD,
            },
            proxy,
          ),
        });
      },
    }),
  }),
  graphql(Mutation.REMOVE_LESSON, {
    props: ({
      mutate,
      ownProps: { linkedTo },
    }) => ({
      onDelete: (e, { entity: { _id, title } }) => swal.promise({
        text: `The lesson learned "${title}" will be permanently deleted`,
        confirmButtonText: 'Delete',
        successTitle: 'Deleted!',
        successText: `The lesson learned "${title}" was deleted successfully.`,
      }, () => mutate({
        variables: {
          input: { _id },
        },
        update: updateGoalFragment(Cache.deleteLessonById(_id), {
          id: linkedTo._id,
          fragment: Fragment.GOAL_CARD,
        }),
      })),
    }),
  }),
)(LessonsSubcard);
