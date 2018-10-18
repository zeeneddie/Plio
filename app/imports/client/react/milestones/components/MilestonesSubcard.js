import PropTypes from 'prop-types';
import React from 'react';
import { CardTitle, Col } from 'reactstrap';
import { pure } from 'recompose';

import {
  Subcard,
  SubcardHeader,
  SubcardBody,
  Pull,
  CardBlock,
  EntityManager,
  EntityManagerItem,
} from '../../components';

import MilestoneSubcard from './MilestoneSubcard';
import NewMilestoneCard from './NewMilestoneCard';
import MilestoneEditContainer from '../containers/MilestoneEditContainer';
import MilestoneAddContainer from '../containers/MilestoneAddContainer';

const MilestonesSubcard = ({ milestones, goalId, organizationId }) => (
  <Subcard>
    <SubcardHeader>
      <Pull left>
        <CardTitle>
          Milestones
        </CardTitle>
      </Pull>
      <Pull right>
        <CardTitle>
          {milestones.length || ''}
        </CardTitle>
      </Pull>
    </SubcardHeader>
    <SubcardBody>
      <CardBlock>
        <Col sm={12}>
          <EntityManager>
            {milestones.map(milestone => (
              <EntityManagerItem
                key={milestone._id}
                entity={milestone}
                milestone={milestone}
                component={MilestoneEditContainer}
                render={MilestoneSubcard}
              />
            ))}
            <MilestoneAddContainer
              {...{ goalId, organizationId }}
              component={NewMilestoneCard}
            />
          </EntityManager>
        </Col>
      </CardBlock>
    </SubcardBody>
  </Subcard>
);

MilestonesSubcard.propTypes = {
  milestones: PropTypes.arrayOf(PropTypes.object).isRequired,
  goalId: PropTypes.string.isRequired,
  organizationId: PropTypes.string.isRequired,
};

export default pure(MilestonesSubcard);
