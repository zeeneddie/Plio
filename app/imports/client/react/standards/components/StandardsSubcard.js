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
import StandardSubcardContainer from '../containers/StandardSubcardContainer';
import StandardAddFormWrapper from './StandardAddFormWrapper';
import NewStandardCard from './NewStandardCard';
import StandardSubcard from './StandardSubcard';

const StandardsSubcard = ({
  organizationId,
  standards,
  onLink,
  onUnlink,
  ...rest
}) => (
  <Subcard>
    <SubcardHeader>
      <Pull left>
        <CardTitle>
          Standards
        </CardTitle>
      </Pull>
      <Pull right>
        <CardTitle>
          {standards.length || ''}
        </CardTitle>
      </Pull>
    </SubcardHeader>
    <SubcardBody>
      <CardBlock>
        <Col sm={12}>
          <EntityManager>
            <Card>
              {standards.map(standard => (
                <EntityManagerItem
                  {...{
                    standard,
                    organizationId,
                    onUnlink,
                  }}
                  key={standard._id}
                  itemId={standard._id}
                  component={StandardSubcardContainer}
                  render={StandardSubcard}
                />
              ))}
            </Card>
            <EntityManagerForms>
              <EntityManagerCards
                {...{ organizationId, onLink, ...rest }}
                keepDirtyOnReinitialize
                label="New standard"
                component={StandardAddFormWrapper}
                render={EntityManagerCard}
              >
                <NewStandardCard {...{ organizationId }} standardIds={getIds(standards)} />
              </EntityManagerCards>
              <EntityManagerAddButton>Add a new standard</EntityManagerAddButton>
            </EntityManagerForms>
          </EntityManager>
        </Col>
      </CardBlock>
    </SubcardBody>
  </Subcard>
);

StandardsSubcard.propTypes = {
  organizationId: PropTypes.string.isRequired,
  standards: PropTypes.array.isRequired,
  onLink: PropTypes.func,
  onUnlink: PropTypes.func,
};

export default StandardsSubcard;

