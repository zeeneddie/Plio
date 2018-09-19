import PropTypes from 'prop-types';
import React from 'react';
import { CardTitle, Col, TabContent, TabPane, Button } from 'reactstrap';

import {
  Subcard,
  SubcardHeader,
  SubcardBody,
  Pull,
  CardBlock,
  Icon,
} from '../../components';
import { WithState } from '../../helpers';
import CustomerInsightsMatcher from './CustomerInsightsMatcher';
import CustomerInsightsPie from './CustomerInsightsPie';

const Tabs = {
  SVG_PIE: 'SvgPie',
  MATCHER: 'Matcher',
};

const CustomerInsightsSubcard = ({
  organizationId,
  documentId,
  documentType,
  needs,
  wants,
  matchedTo,
}) => (
  <Subcard>
    <SubcardHeader>
      <Pull left>
        <CardTitle>
          Customer insights
        </CardTitle>
      </Pull>
      <Pull right>
        <CardTitle>
          {needs.length + wants.length || ''}
        </CardTitle>
      </Pull>
    </SubcardHeader>
    <SubcardBody>
      <CardBlock>
        <Col xs={12} sm={12}>
          <WithState initialState={{ activeTab: Tabs.SVG_PIE }}>
            {({ state, setState }) => (
              <TabContent activeTab={state.activeTab}>
                <TabPane tabId={Tabs.SVG_PIE}>
                  <CustomerInsightsPie
                    {...{
                      needs,
                      wants,
                      organizationId,
                      documentId,
                      documentType,
                    }}
                    onMatchButtonClick={() => setState({ activeTab: Tabs.MATCHER })}
                  />
                </TabPane>
                <TabPane tabId={Tabs.MATCHER}>
                  <CustomerInsightsMatcher
                    {...{
                      needs,
                      wants,
                      documentId,
                      matchedTo,
                    }}
                  />
                  <Pull right>
                    <Button onClick={() => setState({ activeTab: Tabs.SVG_PIE })}>
                      <Icon name="angle-left" margin="right" />
                      Back
                    </Button>
                  </Pull>
                </TabPane>
              </TabContent>
            )}
          </WithState>
        </Col>
      </CardBlock>
    </SubcardBody>
  </Subcard>
);

CustomerInsightsSubcard.propTypes = {
  organizationId: PropTypes.string.isRequired,
  documentId: PropTypes.string.isRequired,
  documentType: PropTypes.string.isRequired,
  needs: PropTypes.arrayOf(PropTypes.object).isRequired,
  wants: PropTypes.arrayOf(PropTypes.object).isRequired,
  matchedTo: PropTypes.shape({
    benefits: PropTypes.arrayOf(PropTypes.object),
    features: PropTypes.arrayOf(PropTypes.object),
  }),
};

export default CustomerInsightsSubcard;
