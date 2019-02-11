import PropTypes from 'prop-types';
import React from 'react';
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
import { getUserOptions, lenses, noop } from 'plio-util';
import diff from 'deep-diff';

import { Composer, WithState, renderComponent } from '../../helpers';
import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { swal } from '../../../util';

const getLesson = pathOr({}, repeat('lesson', 2));
const getInitialValues = compose(
  pick(['title', 'date', 'owner', 'notes']),
  over(lenses.owner, getUserOptions),
);

const LessonEditContainer = ({
  lesson: _lesson = null,
  lessonId,
  organizationId,
  isOpen,
  toggle,
  onDelete,
  refetchQueries,
  fetchPolicy = ApolloFetchPolicies.CACHE_AND_NETWORK,
  ...props
}) => (
  <WithState
    initialState={{
      lesson: _lesson,
      initialValues: unless(isNil, getInitialValues, _lesson),
    }}
  >
    {({ state: { initialValues, lesson }, setState }) => (
      <Composer
        components={[
          /* eslint-disable react/no-children-prop */
          <Query
            {...{ fetchPolicy }}
            query={Queries.LESSON_CARD}
            variables={{ _id: lessonId }}
            skip={!!_lesson}
            onCompleted={data => setState({
              initialValues: getInitialValues(getLesson(data)),
              lesson: getLesson(data),
            })}
            children={noop}
          />,
          <Mutation
            mutation={Mutations.UPDATE_LESSON}
            children={noop}
            onCompleted={({ updateLesson }) => setState({ lesson: updateLesson })}
          />,
          <Mutation
            {...{ refetchQueries }}
            mutation={Mutations.REMOVE_LESSON}
            children={noop}
          />,
          /* eslint-enable react/no-children-prop */
        ]}
      >
        {([
          { loading, error },
          updateLesson,
          deleteLesson,
        ]) => renderComponent({
          ...props,
          error,
          organizationId,
          isOpen,
          toggle,
          initialValues,
          lesson,
          loading,
          onSubmit: async (values, form) => {
            const currentValues = getInitialValues(lesson);
            const difference = diff(values, currentValues);

            if (!difference) return undefined;

            const {
              title,
              date,
              notes = '',
              owner: { value: ownerId },
            } = values;

            return updateLesson({
              variables: {
                input: {
                  _id: lesson._id,
                  title,
                  notes,
                  ownerId,
                  date,
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
              text: `The lesson learned "${lesson.title}" will be permanently deleted`,
              confirmButtonText: 'Delete',
              successTitle: 'Deleted!',
              successText: `The lesson learned "${lesson.title}" was deleted successfully.`,
            }, () => deleteLesson({
              variables: {
                input: { _id: lesson._id },
              },
            })).then(toggle || noop);
          },
        })}
      </Composer>
    )}
  </WithState>
);

LessonEditContainer.propTypes = {
  organizationId: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  refetchQueries: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  lessonId: PropTypes.string,
  lesson: PropTypes.object,
  fetchPolicy: PropTypes.string,
};

export default React.memo(LessonEditContainer);
