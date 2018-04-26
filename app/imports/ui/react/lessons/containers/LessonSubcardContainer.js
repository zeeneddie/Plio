import { graphql } from 'react-apollo';
import { getTargetValue, toDate } from 'plio-util';
import { mergeDeepLeft } from 'ramda';
import { lifecycle } from 'recompose';

import { namedCompose, withMutationState } from '../../helpers';
import { Mutation, Fragment } from '../../../../client/graphql';
import { updateLessonFragment } from '../../../../client/apollo/utils';
import LessonSubcard from '../components/LessonSubcard';

export default namedCompose('LessonSubcardContainer')(
  withMutationState(),
  lifecycle({
    componentWillReceiveProps({ mutation: { error } }) {
      if (error) this.props.reset();
    },
  }),
  graphql(Mutation.UPDATE_LESSON_TITLE, { name: 'updateLessonTitle' }),
  graphql(Mutation.UPDATE_LESSON_DATE, { name: 'updateLessonDate' }),
  graphql(Mutation.UPDATE_LESSON_NOTES, { name: 'updateLessonNotes' }),
  graphql(Mutation.UPDATE_LESSON_OWNER, {
    name: 'updateLessonOwner',
    props: ({
      updateLessonOwner,
      ownProps: {
        updateLessonTitle,
        updateLessonDate,
        updateLessonNotes,
        mutateWithState,
        lesson: { _id },
        mutation: { error, loading },
      },
    }) => {
      const update = name => (proxy, { data: { [name]: { lesson } } }) => updateLessonFragment(
        mergeDeepLeft(lesson),
        {
          id: _id,
          fragment: Fragment.LESSON_CARD,
        },
        proxy,
      );

      return {
        error,
        loading,
        onChangeTitle: e => mutateWithState(updateLessonTitle({
          variables: {
            input: {
              _id,
              title: getTargetValue(e),
            },
          },
          update: update('updateLessonTitle'),
        })),
        onChangeDate: momentDate => mutateWithState(updateLessonDate({
          variables: {
            input: {
              _id,
              date: toDate(momentDate),
            },
          },
          update: update('updateLessonDate'),
        })),
        onChangeOwner: ({ value: owner }) => mutateWithState(updateLessonOwner({
          variables: {
            input: {
              _id,
              owner,
            },
          },
          update: update('updateLessonOwner'),
        })),
        onChangeNotes: notes => mutateWithState(updateLessonNotes({
          variables: {
            input: {
              _id,
              notes,
            },
          },
          update: update('updateLessonNotes'),
        })),
      };
    },
  }),
)(LessonSubcard);
