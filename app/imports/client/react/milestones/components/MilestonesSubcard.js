import PropTypes from 'prop-types';
import React from 'react';
import { CardTitle, Col } from 'reactstrap';

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

const MilestonesSubcard = ({
  milestones,
  goalId,
  organizationId,
  onLink,
  onUnlink,
}) => (
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
                {...{ organizationId, onUnlink }}
                key={milestone._id}
                itemId={milestone._id}
                milestone={milestone}
                component={MilestoneEditContainer}
                render={MilestoneSubcard}
              />
            ))}
            <MilestoneAddContainer
              {...{
                goalId,
                organizationId,
                onLink,
              }}
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
  onLink: PropTypes.func,
  onUnlink: PropTypes.func,
};

export default React.memo(MilestonesSubcard);
