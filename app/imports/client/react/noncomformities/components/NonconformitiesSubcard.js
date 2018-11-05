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
  Magnitudes,
} from '../../components';
import { ProblemTypes } from '../../../../share/constants';
import NonconformitySubcardContainer from '../containers/NonconformitySubcardContainer';
import NonconformityAddFormWrapper from './NonconformityAddFormWrapper';
import NewNonconformityCard from './NewNonconformityCard';
import NewPotentialGainCard from './NewPotentialGainCard';
import NonconformitySubcard from './NonconformitySubcard';

const NonconformitiesSubcard = ({
  organizationId,
  nonconformities,
  onLink,
  type,
  guidelines,
  onUnlink,
  ...rest
}) => {
  const isPotentialGain = type === ProblemTypes.POTENTIAL_GAIN;
  return (
    <Subcard>
      <SubcardHeader>
        <Pull left>
          <CardTitle>
            {isPotentialGain ? 'Potential gains' : 'Nonconformities'}
          </CardTitle>
        </Pull>
        <Pull right>
          <CardTitle>
            {nonconformities.length || ''}
          </CardTitle>
        </Pull>
      </SubcardHeader>
      <SubcardBody>
        <CardBlock>
          <Col sm={12}>
            <EntityManager>
              <Card>
                {nonconformities.map(nonconformity => (
                  <EntityManagerItem
                    {...{
                      nonconformity,
                      organizationId,
                      guidelines,
                      onUnlink,
                      type,
                    }}
                    key={nonconformity._id}
                    itemId={nonconformity._id}
                    component={NonconformitySubcardContainer}
                    render={NonconformitySubcard}
                  />
                ))}
              </Card>
              <EntityManagerForms>
                <EntityManagerCards
                  {...{
                    ...rest,
                    organizationId,
                    onLink,
                    type,
                  }}
                  keepDirtyOnReinitialize
                  label={isPotentialGain ? 'New potential gain' : 'New nonconformity'}
                  component={NonconformityAddFormWrapper}
                  render={EntityManagerCard}
                >
                  {isPotentialGain ? (
                    <NewPotentialGainCard
                      {...{ organizationId, guidelines }}
                      potentialGainIds={getIds(nonconformities)}
                    />
                  ) : (
                    <NewNonconformityCard
                      {...{ organizationId, guidelines }}
                      nonconformityIds={getIds(nonconformities)}
                    />
                  )}
                </EntityManagerCards>
                <EntityManagerAddButton>
                  {isPotentialGain ? 'Add a new potential gain' : 'Add a new nonconformity'}
                </EntityManagerAddButton>
              </EntityManagerForms>
            </EntityManager>
          </Col>
        </CardBlock>
      </SubcardBody>
    </Subcard>
  );
};

NonconformitiesSubcard.propTypes = {
  organizationId: PropTypes.string.isRequired,
  nonconformities: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  onLink: PropTypes.func,
  // eslint-disable-next-line react/no-typos
  guidelines: Magnitudes.propTypes.guidelines,
  onUnlink: PropTypes.func,
};

export default NonconformitiesSubcard;
