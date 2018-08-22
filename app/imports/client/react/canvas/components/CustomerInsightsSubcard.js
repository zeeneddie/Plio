import React, { Fragment } from 'react';
import { CardTitle, Col, TabContent } from 'reactstrap';

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
} from '../../components';

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
            {({ activeTab }) => (
              <Fragment>
                <MatchMakerPie circle>
                  <MatchMakerLeftPieSlice label="Needs" text="(3)" />
                  <MatchMakerRightPieSlice label="Wants" text="(3)" />
                </MatchMakerPie>
                <MatchButton alignLeft hidden={!!activeTab}>Match</MatchButton>
                <TabContent {...{ activeTab }}>
                  <MatchMakerPane
                    alignLeft
                    label="Needs"
                    newEntityButtonTitle="Add a customer need"
                  >
                    Needs
                  </MatchMakerPane>
                  <MatchMakerPane
                    alignRight
                    label="Wants"
                    newEntityButtonTitle="Add a customer want"
                  >
                    Wants
                  </MatchMakerPane>
                </TabContent>
              </Fragment>
            )}
          </MatchMaker>
        </Col>
      </CardBlock>
    </SubcardBody>
  </Subcard>
);

CustomerInsightsSubcard.propTypes = {};

export default CustomerInsightsSubcard;
