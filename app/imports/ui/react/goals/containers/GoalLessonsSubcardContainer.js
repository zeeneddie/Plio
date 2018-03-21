import { withProps } from 'recompose';
import moment from 'moment';
import { graphql } from 'react-apollo';
import { FORM_ERROR } from 'final-form';
import { Cache, toDate, getUserOptions } from 'plio-util';

import { namedCompose } from '../../helpers';
import { LessonsSubcard } from '../../lessons';
import { Mutation, Fragment } from '../../../../client/graphql';
import { DocumentTypes } from '../../../../share/constants';
import { updateGoalFragment } from '../../../../client/apollo/utils';
import { swal } from '../../../../client/util';

export default namedCompose('GoalLessonsSubcardContainer')(
  graphql(Mutation.CREATE_LESSON, {
    props: ({
      mutate,
      ownProps: {
        linkedTo,
        organizationId,
      },
    }) => ({
      onSave: async (
        {
          title,
          date,
          notes,
          owner: { value: owner } = {},
        },
        {
          ownProps: { flush },
        },
      ) => {
        const errors = [];

        if (!title) errors.push('Title is required');
        if (!notes) errors.push('Notes are required');

        if (errors.length) return { [FORM_ERROR]: errors.join('\n') };

        try {
          const { data } = await mutate({
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
          const { createLesson: { lesson } } = data;

          return flush(lesson);
        } catch ({ message }) {
          return { [FORM_ERROR]: message };
        }
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
  withProps(({ user }) => ({
    initialValues: {
      owner: getUserOptions(user),
      date: moment(),
    },
  })),
)(LessonsSubcard);
