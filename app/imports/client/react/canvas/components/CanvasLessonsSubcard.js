import React from 'react';
import PropTypes from 'prop-types';

import { LessonsSubcard, LessonAddContainer } from '../../lessons';

const CanvasLessonsSubcard = ({
  linkedTo,
  refetchQuery,
  documentType,
  organizationId,
  lessons,
}) => (
  <LessonAddContainer
    {...{
      linkedTo,
      refetchQuery,
      documentType,
      organizationId,
      lessons,
    }}
    documentId={linkedTo._id}
    render={({ onSubmit, ...restLessonProps }) => (
      <LessonsSubcard {...restLessonProps} onSave={onSubmit} />
    )}
  />
);

CanvasLessonsSubcard.propTypes = {
  linkedTo: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  organizationId: PropTypes.string.isRequired,
  refetchQuery: PropTypes.object.isRequired,
  documentType: PropTypes.string.isRequired,
  lessons: PropTypes.arrayOf(PropTypes.object),
};

export default CanvasLessonsSubcard;
