import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { EntitySubcard } from '../../components';
import LessonForm from './LessonForm';

const LessonSubcard = ({
  lesson,
  isOpen,
  toggle,
  onDelete,
  error,
  loading,
  ...props
}) => (
  <EntitySubcard
    entity={lesson}
    header={() => (
      <Fragment>
        <strong>{lesson.sequentialId}</strong>
        {' '}
        {lesson.title}
      </Fragment>
    )}
    {...{
      isOpen,
      toggle,
      loading,
      error,
      onDelete,
    }}
  >
    <LessonForm {...props} />
  </EntitySubcard>
);

LessonSubcard.propTypes = {
  lesson: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  error: PropTypes.string,
  loading: PropTypes.bool,
};

export default LessonSubcard;
