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
  MatchMaker,
  MatchMakerPane,
  MatchMakerPie,
  MatchMakerTopPieSlice,
  MatchMakerBottomPieSlice,
  MatchButton,
  MatchMakerTabs,
} from '../../components';
import Benefits from './Benefits';
import Features from './Features';

const ValueComponentsSubcard = ({
  documentId,
  documentType,
  organizationId,
  benefits,
  features,
}) => (
  <Subcard>
    <SubcardHeader>
      <Pull left>
        <CardTitle>
          Value components
        </CardTitle>
      </Pull>
      <Pull right>
        <CardTitle>
          {benefits.length + features.length || ''}
        </CardTitle>
      </Pull>
    </SubcardHeader>
    <SubcardBody>
      <CardBlock>
        <Col xs={12} sm={12}>
          <MatchMaker>
            <MatchMakerPie square>
              <MatchMakerTopPieSlice
                label="Benefits"
                text={`${benefits.length}, 0 matched`}
              />
              <MatchMakerBottomPieSlice
                label="Features"
                text={`${features.length}, 0 matched`}
              />
            </MatchMakerPie>
            <MatchButton alignRight>Match</MatchButton>
            <MatchMakerTabs>
              <MatchMakerPane alignLeft>
                <Benefits
                  {...{
                    documentId,
                    documentType,
                    organizationId,
                    benefits,
                  }}
                />
              </MatchMakerPane>
              <MatchMakerPane alignRight>
                <Features
                  {...{
                    documentId,
                    documentType,
                    organizationId,
                    features,
                  }}
                />
              </MatchMakerPane>
            </MatchMakerTabs>
          </MatchMaker>
        </Col>
      </CardBlock>
    </SubcardBody>
  </Subcard>
);

ValueComponentsSubcard.propTypes = {
  documentId: PropTypes.string.isRequired,
  documentType: PropTypes.string.isRequired,
  organizationId: PropTypes.string.isRequired,
  benefits: PropTypes.arrayOf(PropTypes.object).isRequired,
  features: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default pure(ValueComponentsSubcard);
