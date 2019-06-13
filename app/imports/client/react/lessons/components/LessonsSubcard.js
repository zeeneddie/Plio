import React from 'react';
import PropTypes from 'prop-types';
import { CardTitle, Col } from 'reactstrap';

import {
  Subcard,
  SubcardHeader,
  SubcardBody,
  Pull,
  CardBlock,
  EntityManager,
  EntityManagerItem,
  EntityManagerAddButton,
  EntityManagerForms,
  EntityManagerCards,
  EntityManagerCard,
} from '../../components';
import LessonEditContainer from '../containers/LessonEditContainer';
import LessonSubcard from './LessonSubcard';
import LessonAddFormWrapper from './LessonAddFormWrapper';
import LessonForm from './LessonForm';

const LessonsSubcard = ({
  organizationId,
  lessons,
  linkedTo,
  onLink,
  onUnlink,
  documentType,
  refetchQueries,
}) => (
  <Subcard>
    <SubcardHeader>
      <Pull left>
        <CardTitle>Lessons learned</CardTitle>
      </Pull>
      <Pull right>
        <CardTitle>{lessons.length || ''}</CardTitle>
      </Pull>
    </SubcardHeader>
    <SubcardBody>
      <CardBlock>
        <Col sm={12}>
          <EntityManager>
            {lessons.map(lesson => (
              <EntityManagerItem
                {...{
                  organizationId,
                  lesson,
                  linkedTo,
                  onUnlink,
                  refetchQueries,
                }}
                key={lesson._id}
                itemId={lesson._id}
                component={LessonEditContainer}
                render={LessonSubcard}
              />
            ))}
            <EntityManagerForms>
              <EntityManagerCards
                {...{
                  documentId: linkedTo._id,
                  organizationId,
                  documentType,
                  onLink,
                  onUnlink,
                  refetchQueries,
                }}
                keepDirtyOnReinitialize
                label="New lesson learned"
                component={LessonAddFormWrapper}
                render={EntityManagerCard}
              >
                <LessonForm {...{ linkedTo, organizationId }} />
              </EntityManagerCards>
              <EntityManagerAddButton>Add a new lesson learned</EntityManagerAddButton>
            </EntityManagerForms>
          </EntityManager>
        </Col>
      </CardBlock>
    </SubcardBody>
  </Subcard>
);

LessonsSubcard.propTypes = {
  organizationId: PropTypes.string.isRequired,
  lessons: PropTypes.array.isRequired,
  documentType: PropTypes.string.isRequired,
  refetchQueries: PropTypes.func.isRequired,
  linkedTo: PropTypes.object,
  onLink: PropTypes.func.isRequired,
  onUnlink: PropTypes.func.isRequired,
};

export default LessonsSubcard;
