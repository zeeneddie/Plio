import React from 'react';
import PropTypes from 'prop-types';
import { Query, Mutation } from 'react-apollo';
import { noop, getUserOptions } from 'plio-util';

import { Query as Queries, Mutation as Mutations } from '../../../graphql';
import { ApolloFetchPolicies } from '../../../../api/constants';
import { validateLesson } from '../../../validation';
import { Composer, renderComponent } from '../../helpers';

const LessonAddContainer = ({
  organizationId,
  isOpen,
  toggle,
  documentId,
  documentType,
  refetchQueries,
  onLink,
  onUnlink,
  ...props
}) => (
  <Composer
    components={[
      /* eslint-disable react/no-children-prop */
      <Query
        query={Queries.CURRENT_USER_FULL_NAME}
        fetchPolicy={ApolloFetchPolicies.CACHE_ONLY}
        children={noop}
      />,
      <Mutation
        {...{ refetchQueries }}
        mutation={Mutations.CREATE_LESSON}
        children={noop}
      />,
      /* eslint-enable react/no-children-prop */
    ]}
  >
    {([{ data: { user } }, createLesson]) => renderComponent({
      ...props,
      isOpen,
      toggle,
      organizationId,
      initialValues: {
        title: '',
        notes: '',
        owner: getUserOptions(user),
        date: Date.now(),
      },
      onSubmit: (values) => {
        const {
          title,
          date,
          notes,
          owner: { value: owner },
        } = values;

        const errors = validateLesson(values);
        if (errors) return errors;

        return createLesson({
          variables: {
            input: {
              title,
              owner,
              notes,
              organizationId,
              date,
              linkedTo: {
                documentId,
                documentType,
              },
            },
          },
        }).then(({ data: { createLesson: { lesson } } }) => onLink(lesson._id))
          .then(toggle || noop);
      },
    })}
  </Composer>
);

LessonAddContainer.propTypes = {
  organizationId: PropTypes.string.isRequired,
  documentId: PropTypes.string.isRequired,
  documentType: PropTypes.string.isRequired,
  refetchQueries: PropTypes.func.isRequired,
  onLink: PropTypes.func.isRequired,
  onUnlink: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};

export default LessonAddContainer;
