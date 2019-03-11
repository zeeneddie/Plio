import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { TabContent, TabPane, Button } from 'reactstrap';

import { Styles } from '../../../../api/constants';
import { WithState } from '../../helpers';
import { Pull, Icon } from '../../components';

const Tabs = {
  PIE: 'pie',
  MATCHER: 'matcher',
};

const HelpText = styled.p`
  margin: 0 -2.25rem 1.45rem -2.25rem;
  padding: 0 2.25rem 1.45rem 2.25rem;
  border-bottom: 1px solid ${Styles.border.color.grey};
`;

const CustomerElementsMatch = ({
  renderPie,
  renderMatcher,
  guidance,
  ...props
}) => (
  <WithState initialState={{ activeTab: Tabs.PIE }}>
    {({ state, setState }) => (
      <TabContent activeTab={state.activeTab}>
        <TabPane tabId={Tabs.PIE}>
          {renderPie({
            setActiveMatcher: () => setState({ activeTab: Tabs.MATCHER }),
            ...props,
          })}
        </TabPane>
        <TabPane tabId={Tabs.MATCHER}>
          <HelpText>{guidance}</HelpText>
          {renderMatcher(props)}
          <Pull right>
            <Button onClick={() => setState({ activeTab: Tabs.PIE })}>
              <Icon name="angle-left" margin="right" />
              Back
            </Button>
          </Pull>
        </TabPane>
      </TabContent>
    )}
  </WithState>
);

CustomerElementsMatch.propTypes = {
  renderPie: PropTypes.func.isRequired,
  renderMatcher: PropTypes.func.isRequired,
  guidance: PropTypes.string.isRequired,
};

export default CustomerElementsMatch;
