import React from 'react';
import { CardTitle, Col } from 'reactstrap';

import {
  Subcard,
  SubcardHeader,
  SubcardBody,
  Pull,
  CardBlock,
  MatchMaker,
  MatchMakerPane,
  MatchMakerPie,
  MatchMakerLeftPieSlice,
  MatchMakerRightPieSlice,
  MatchButton,
  MatchMakerTabs,
} from '../../components';
import CustomerNeeds from './CustomerNeeds';
import CustomerWants from './CustomerWants';

const CustomerInsightsSubcard = () => (
  <Subcard>
    <SubcardHeader>
      <Pull left>
        <CardTitle>
          Customer insights
        </CardTitle>
      </Pull>
      <Pull right>
        <CardTitle>
          10
        </CardTitle>
      </Pull>
    </SubcardHeader>
    <SubcardBody>
      <CardBlock>
        <Col xs={12} sm={12}>
          <MatchMaker>
            <MatchMakerPie circle>
              <MatchMakerLeftPieSlice label="Needs" text="(3)" />
              <MatchMakerRightPieSlice label="Wants" text="(3)" />
            </MatchMakerPie>
            <MatchButton alignRight>Match</MatchButton>
            <MatchMakerTabs>
              <MatchMakerPane alignLeft>
                <CustomerNeeds />
              </MatchMakerPane>
              <MatchMakerPane alignRight>
                <CustomerWants />
              </MatchMakerPane>
            </MatchMakerTabs>
          </MatchMaker>
        </Col>
      </CardBlock>
    </SubcardBody>
  </Subcard>
);

CustomerInsightsSubcard.propTypes = {};

export default CustomerInsightsSubcard;
