import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isEmpty, any } from 'ramda';
import { CardTitle, Col, CardText, ListGroup, FormText } from 'reactstrap';
import { pure } from 'recompose';

import { Styles } from '../../../../../api/constants';
import { DocumentTypes } from '../../../../../share/constants';
import {
  Subcard,
  SubcardHeader,
  SubcardBody,
  SubcardSubtitle,
  CardBlock,
  EntityManager,
  EntitiesField,
  Magnitudes,
  RelationsAdapter,
} from '../../../components';
import GoalActivelyManageItem from './GoalActivelyManageItem';
import StandardActivelyManageItem from './StandardActivelyManageItem';
import RiskActivelyManageItem from './RiskActivelyManageItem';
import LessonActivelyManageItem from './LessonActivelyManageItem';
import NonconformityActivelyManageItem from './NonconformityActivelyManageItem';
import PotentialGainActivelyManageItem from './PotentialGainActivelyManageItem';

const StyledCol = styled(Col)`
  padding: 0 1.85rem;
  .card & .list-group {
    border: 1px solid #ddd;
    border-radius: .25rem;
    & > .list-group-item {
      border-left: 0;
      border-right: 0;
      padding: .75rem 1.25rem !important;
      color: ${Styles.color.brandPrimary};
      &:hover {
        color: ${Styles.color.brandPrimary};
      }
      & > i {
        float: right;
        font-size: 1.3rem;
        margin-top: 3px;
      }
      &:first-child {
        border-top: 0 !important;
      }
      &:last-child {
        border-bottom: 0;
      }
      &:focus {
        outline: none;
      }
    }
  }
`;
const StyledCardBlock = styled(CardBlock)`
  &.card-block {
    padding: 0;
  }
`;

const ActivelyManageSubcard = ({
  linkedTo,
  documentType,
  organizationId,
  refetchQueries,
  rkGuidelines,
  ncGuidelines,
  pgGuidelines,
  goals,
  standards,
  risks,
  nonconformities,
  potentialGains,
  lessons,
}) => any(
  isEmpty,
  [goals, standards, risks, nonconformities, potentialGains, lessons],
) && (
  <StyledCardBlock>
    <Subcard>
      <SubcardHeader>
        <CardTitle>
          Actively Manage
        </CardTitle>
        <SubcardSubtitle>
          <FormText color="muted" tag="span">
            Only by actively managing your canvas will you be able to translate
            your business design into better business performance.
          </FormText>
        </SubcardSubtitle>
      </SubcardHeader>
      <SubcardBody>
        <CardBlock>
          <StyledCol xs={12} sm={12}>
            <CardText>
              To actively manage this section of your canvas,
              you need to do at least one of the following:
            </CardText>
            <ListGroup>
              <EntityManager>
                {!goals.length && (
                  <RelationsAdapter
                    {...{
                      organizationId,
                      goals,
                      documentId: linkedTo._id,
                      documentType,
                      refetchQueries,
                    }}
                    relatedDocumentType={DocumentTypes.GOAL}
                    render={GoalActivelyManageItem}
                  />
                )}
                {!standards.length && (
                  <RelationsAdapter
                    {...{
                      organizationId,
                      standards,
                      documentId: linkedTo._id,
                      documentType,
                      refetchQueries,
                    }}
                    relatedDocumentType={DocumentTypes.STANDARD}
                    render={StandardActivelyManageItem}
                  />
                )}
                {!risks.length && (
                  <RelationsAdapter
                    {...{
                      organizationId,
                      risks,
                      documentId: linkedTo._id,
                      documentType,
                      refetchQueries,
                      linkedTo,
                    }}
                    relatedDocumentType={DocumentTypes.RISK}
                    render={RiskActivelyManageItem}
                    guidelines={rkGuidelines}
                  />
                )}
                {!nonconformities.length && (
                  <RelationsAdapter
                    {...{
                      organizationId,
                      nonconformities,
                      documentId: linkedTo._id,
                      documentType,
                      refetchQueries,
                    }}
                    relatedDocumentType={DocumentTypes.NON_CONFORMITY}
                    render={NonconformityActivelyManageItem}
                    guidelines={ncGuidelines}
                  />
                )}
                {!potentialGains.length && (
                  <RelationsAdapter
                    {...{
                      organizationId,
                      potentialGains,
                      documentId: linkedTo._id,
                      documentType,
                      refetchQueries,
                    }}
                    relatedDocumentType={DocumentTypes.POTENTIAL_GAIN}
                    render={PotentialGainActivelyManageItem}
                    guidelines={pgGuidelines}
                  />
                )}
                <EntitiesField
                  name="lessons"
                  render={LessonActivelyManageItem}
                  is={isEmpty}
                  {...{
                    organizationId,
                    documentType,
                    refetchQueries,
                    linkedTo,
                  }}
                />
              </EntityManager>
            </ListGroup>
          </StyledCol>
        </CardBlock>
      </SubcardBody>
    </Subcard>
  </StyledCardBlock>
);

ActivelyManageSubcard.propTypes = {
  organizationId: PropTypes.string.isRequired,
  documentType: PropTypes.string.isRequired,
  refetchQueries: PropTypes.func.isRequired,
  linkedTo: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  /* eslint-disable react/no-typos */
  rkGuidelines: Magnitudes.propTypes.guidelines,
  ncGuidelines: Magnitudes.propTypes.guidelines,
  pgGuidelines: Magnitudes.propTypes.guidelines,
  /* eslint-disable react/no-typos */
};

export default pure(ActivelyManageSubcard);
