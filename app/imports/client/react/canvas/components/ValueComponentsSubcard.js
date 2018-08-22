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
  MatchMakerTopPieSlice,
  MatchMakerBottomPieSlice,
  MatchButton,
} from '../../components';

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
            {({ activeTab }) => (
              <Fragment>
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
                <MatchButton alignRight hidden={!!activeTab}>Match</MatchButton>
                <TabContent {...{ activeTab }}>
                  <MatchMakerPane
                    alignLeft
                    label="Benefits"
                    newEntityButtonTitle="Add a benefit"
                  >
                    Benefits
                  </MatchMakerPane>
                  <MatchMakerPane
                    alignRight
                    label="Features"
                    newEntityButtonTitle="Add a feature"
                  >
                    Features
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

ValueComponentsSubcard.propTypes = {};

export default ValueComponentsSubcard;
