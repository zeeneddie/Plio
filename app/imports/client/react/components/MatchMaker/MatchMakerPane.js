import PropTypes from 'prop-types';
import React from 'react';
import { Card, TabPane, Button } from 'reactstrap';
import is from 'styled-is';
import styled from 'styled-components';
import { StyledMixins } from 'plio-util';

import { Subcard, SubcardHeader, SubcardBody, CardBlock, TextAlign } from '../../components';
import { OpenTabState } from './MatchMaker';

const StyledTabPane = styled(({ alignLeft, alignRight, ...rest }) => <TabPane {...rest} />).attrs({
  tabId: ({ alignLeft, alignRight, tabId }) => {
    if (alignLeft) return OpenTabState.LEFT;
    if (alignRight) return OpenTabState.RIGHT;
    return tabId;
  },
})`
  ${StyledMixins.media.notMobile`
    ${is('alignLeft')`
      margin-right: 170px;
    `}

    ${is('alignRight')`
      margin-left: 170px;
    `}
  `}

  ${StyledMixins.media.mobile`
    margin-left: -1.25rem;
    margin-right: -1.25rem;

    & > .card {
      width: auto;
      margin-left: inherit;
      margin-right: inherit;
      border-top: 1px solid #ddd;
    }
  `}
`;

// TODO: replace subcard with entity manager subcard
const MatchMakerPane = ({
  label,
  children,
  newEntityButtonTitle,
  ...props
}) => (
  <StyledTabPane {...props}>
    <Card>
      <Subcard>
        <SubcardHeader>{label}</SubcardHeader>
        <SubcardBody>
          <CardBlock>
            {children}
          </CardBlock>
        </SubcardBody>
      </Subcard>
    </Card>
    <TextAlign center>
      <div>
        <Button color="link">{newEntityButtonTitle}</Button>
      </div>
    </TextAlign>
  </StyledTabPane>
);

MatchMakerPane.propTypes = {
  tabId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  alignLeft: PropTypes.bool,
  alignRight: PropTypes.bool,
  label: PropTypes.string.isRequired,
  newEntityButtonTitle: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default MatchMakerPane;
