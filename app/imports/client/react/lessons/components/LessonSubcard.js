import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'reactstrap';

import { validateLesson } from '../../../validation';
import { EntityForm, EntityCard } from '../../components';
import LessonForm from './LessonForm';

const LessonSubcard = ({
  lesson,
  onSubmit,
  organizationId,
  initialValues,
  isOpen,
  toggle,
  onDelete,
  ...rest
}) => (
  <Fragment>
    <Card>
      <EntityForm
        {...{
          isOpen,
          toggle,
          onDelete,
          onSubmit,
          initialValues,
        }}
        label={(
          <Fragment>
            <strong>{lesson.sequentialId}</strong>
            {' '}
            {lesson.title}
          </Fragment>
        )}
        validate={validateLesson}
        component={EntityCard}
      >
        {({ handleSubmit }) => (
          <LessonForm
            {...{ organizationId, ...rest }}
            save={handleSubmit}
          />
        )}
      </EntityForm>
    </Card>
  </Fragment>
);

LessonSubcard.propTypes = {
  lesson: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default LessonSubcard;
