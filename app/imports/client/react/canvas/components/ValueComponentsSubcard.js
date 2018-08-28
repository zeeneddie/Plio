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
  MatchMakerTopPieSlice,
  MatchMakerBottomPieSlice,
  MatchButton,
  MatchMakerTabs,
} from '../../components';
import Benefits from './Benefits';
import Features from './Features';

const ValueComponentsSubcard = () => (
  <Subcard>
    <SubcardHeader>
      <Pull left>
        <CardTitle>
          Value components
        </CardTitle>
      </Pull>
      <Pull right>
        <CardTitle>
          11
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
                text="(3, 2 matched)"
              />
              <MatchMakerBottomPieSlice
                label="Features"
                text="(4, 2 matched)"
              />
            </MatchMakerPie>
            <MatchButton alignRight>Match</MatchButton>
            <MatchMakerTabs>
              <MatchMakerPane alignLeft>
                <Benefits />
              </MatchMakerPane>
              <MatchMakerPane alignRight>
                <Features />
              </MatchMakerPane>
            </MatchMakerTabs>
          </MatchMaker>
        </Col>
      </CardBlock>
    </SubcardBody>
  </Subcard>
);

export default ValueComponentsSubcard;
