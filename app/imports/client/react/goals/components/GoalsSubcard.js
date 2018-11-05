import React from 'react';
import PropTypes from 'prop-types';
import { CardTitle, Col, Card } from 'reactstrap';
import { getIds } from 'plio-util';

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
import GoalSubcardContainer from '../containers/GoalSubcardContainer';
import GoalAddFormWrapper from './GoalAddFormWrapper';
import NewGoalCard from './NewGoalCard';
import GoalSubcard from './GoalSubcard';

const GoalsSubcard = ({
  organizationId,
  goals,
  onLink,
  onUnlink,
  canEditGoals,
  ...rest
}) => (
  <Subcard>
    <SubcardHeader>
      <Pull left>
        <CardTitle>
          Key goals
        </CardTitle>
      </Pull>
      <Pull right>
        <CardTitle>
          {goals.length || ''}
        </CardTitle>
      </Pull>
    </SubcardHeader>
    <SubcardBody>
      <CardBlock>
        <Col sm={12}>
          <EntityManager>
            <Card>
              {goals.map(goal => (
                <EntityManagerItem
                  {...{
                    organizationId,
                    goal,
                    onUnlink,
                    canEditGoals,
                  }}
                  key={goal._id}
                  itemId={goal._id}
                  component={GoalSubcardContainer}
                  render={GoalSubcard}
                />
              ))}
            </Card>
            <EntityManagerForms>
              <EntityManagerCards
                {...{ organizationId, onLink, ...rest }}
                keepDirtyOnReinitialize
                label="New key goal"
                component={GoalAddFormWrapper}
                render={EntityManagerCard}
              >
                <NewGoalCard {...{ organizationId }} goalIds={getIds(goals)} />
              </EntityManagerCards>
              <EntityManagerAddButton>Add a new key goal</EntityManagerAddButton>
            </EntityManagerForms>
          </EntityManager>
        </Col>
      </CardBlock>
    </SubcardBody>
  </Subcard>
);

GoalsSubcard.propTypes = {
  organizationId: PropTypes.string.isRequired,
  goals: PropTypes.array.isRequired,
  canEditGoals: PropTypes.bool,
  onLink: PropTypes.func,
  onUnlink: PropTypes.func,
};

export default GoalsSubcard;
