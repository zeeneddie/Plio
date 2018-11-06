import React from 'react';
import PropTypes from 'prop-types';

import { LessonsSubcard, LessonAddContainer } from '../../lessons';

const CanvasLessonsSubcard = ({
  linkedTo,
  refetchQuery,
  documentType,
  organizationId,
  lessons,
  onLink,
  onUnlink,
}) => (
  <LessonAddContainer
    {...{
      linkedTo,
      refetchQuery,
      documentType,
      organizationId,
      lessons,
      onLink,
      onUnlink,
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
  onLink: PropTypes.func.isRequired,
  onUnlink: PropTypes.func.isRequired,
  lessons: PropTypes.arrayOf(PropTypes.object),
};

export default CanvasLessonsSubcard;
