import React from 'react';
import PropTypes from 'prop-types';
import { CardTitle, Col } from 'reactstrap';
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
import RiskAddFormWrapper from './RiskAddFormWrapper';
import NewRiskCard from './NewRiskCard';
import RiskSubcard from './RiskSubcard';
import RiskSubcardContainer from '../containers/RiskSubcardContainer';

const RisksSubcard = ({
  organizationId,
  risks,
  linkedTo,
  guidelines,
  onLink,
  onUnlink,
}) => (
  <Subcard>
    <SubcardHeader>
      <Pull left>
        <CardTitle>
          Risks
        </CardTitle>
      </Pull>
      <Pull right>
        <CardTitle>
          {risks.length || ''}
        </CardTitle>
      </Pull>
    </SubcardHeader>
    <SubcardBody>
      <CardBlock>
        <Col sm={12}>
          <EntityManager>
            {risks.map(risk => (
              <EntityManagerItem
                {...{
                  organizationId,
                  risk,
                  guidelines,
                  linkedTo,
                  onUnlink,
                }}
                key={risk._id}
                itemId={risk._id}
                component={RiskSubcardContainer}
                render={RiskSubcard}
              />
            ))}
            <EntityManagerForms>
              <EntityManagerCards
                {...{
                  organizationId,
                  onLink,
                  onUnlink,
                }}
                keepDirtyOnReinitialize
                label="New risk"
                component={RiskAddFormWrapper}
                render={EntityManagerCard}
              >
                <NewRiskCard
                  {...{ organizationId, linkedTo, guidelines }}
                  riskIds={getIds(risks)}
                />
              </EntityManagerCards>
              <EntityManagerAddButton>Add a new risk</EntityManagerAddButton>
            </EntityManagerForms>
          </EntityManager>
        </Col>
      </CardBlock>
    </SubcardBody>
  </Subcard>
);

RisksSubcard.propTypes = {
  organizationId: PropTypes.string.isRequired,
  risks: PropTypes.array.isRequired,
  linkedTo: PropTypes.object,
  guidelines: PropTypes.object,
  onLink: PropTypes.func.isRequired,
  onUnlink: PropTypes.func.isRequired,
};

export default RisksSubcard;
