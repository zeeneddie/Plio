import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isEmpty } from 'ramda';
import { CardTitle, Col, CardText, ListGroup, FormText } from 'reactstrap';

import { Styles } from '../../../../../api/constants';
import {
  Subcard,
  SubcardHeader,
  SubcardBody,
  SubcardSubtitle,
  CardBlock,
  EntityManager,
  EntitiesField,
  FieldCondition,
  Magnitudes,
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
  padding: 0;
`;

const ActivelyManageSubcard = ({
  linkedTo,
  documentType,
  onChange,
  organizationId,
  refetchQuery,
  rkGuidelines,
  ncGuidelines,
  pgGuidelines,
}) => (
  <FieldCondition when="shouldRenderActivelyManage" is>
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
                  <EntitiesField
                    name="goals"
                    render={GoalActivelyManageItem}
                    is={isEmpty}
                    {...{ organizationId, onChange }}
                  />
                  <EntitiesField
                    name="standards"
                    render={StandardActivelyManageItem}
                    is={isEmpty}
                    {...{ organizationId, onChange }}
                  />
                  <EntitiesField
                    name="risks"
                    render={RiskActivelyManageItem}
                    is={isEmpty}
                    guidelines={rkGuidelines}
                    {...{ organizationId, onChange, linkedTo }}
                  />
                  <EntitiesField
                    name="nonconformities"
                    render={NonconformityActivelyManageItem}
                    is={isEmpty}
                    guidelines={ncGuidelines}
                    {...{ organizationId, onChange }}
                  />
                  <EntitiesField
                    name="potentialGains"
                    render={PotentialGainActivelyManageItem}
                    is={isEmpty}
                    guidelines={pgGuidelines}
                    {...{ organizationId, onChange }}
                  />
                  <FieldCondition when="lessons" is={isEmpty}>
                    <LessonActivelyManageItem
                      {...{
                        organizationId,
                        documentType,
                        refetchQuery,
                        linkedTo,
                      }}
                    />
                  </FieldCondition>
                </EntityManager>
              </ListGroup>
            </StyledCol>
          </CardBlock>
        </SubcardBody>
      </Subcard>
    </StyledCardBlock>
  </FieldCondition>
);

ActivelyManageSubcard.propTypes = {
  organizationId: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  documentType: PropTypes.string.isRequired,
  refetchQuery: PropTypes.object.isRequired,
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

export default ActivelyManageSubcard;
