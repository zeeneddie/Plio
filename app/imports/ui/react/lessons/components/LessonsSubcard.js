import PropTypes from 'prop-types';
import React from 'react';
import { Form } from 'react-final-form';
import { pick, over, compose } from 'ramda';
import { lenses, getUserOptions } from 'plio-util';

import { EntityManagerSubcard } from '../../components';
import LessonForm from './LessonForm';
import LessonSubcardContainer from '../containers/LessonSubcardContainer';

const getInitialValues = compose(
  pick(['title', 'date', 'owner', 'notes']),
  over(lenses.owner, getUserOptions),
);

const LessonsSubcard = ({ lessons, onDelete, ...props }) => (
  <EntityManagerSubcard
    title="Lessons learned"
    newEntityTitle="New lesson learned"
    newEntityButtonTitle="Add a new lesson learned"
    entities={lessons}
    renderNewEntity={() => <LessonForm {...props} />}
    render={({ entity, isOpen, toggle }) => (
      <Form
        onSubmit={() => null}
        key={entity._id}
        initialValues={getInitialValues(entity)}
        subscription={{}}
        render={({ form: { reset } }) => (
          <LessonSubcardContainer
            lesson={entity}
            {...{
              isOpen,
              toggle,
              onDelete,
              reset,
              ...props,
            }}
          />
        )}
      />
    )}
    {...props}
  />
);

LessonsSubcard.propTypes = {
  lessons: PropTypes.arrayOf(PropTypes.object),
  onDelete: PropTypes.func.isRequired,
};

export default LessonsSubcard;
