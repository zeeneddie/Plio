import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'reactstrap';
import cx from 'classnames';
import styled from 'styled-components';

import Collapse from './Collapse';
import CardBlock from './CardBlock';

const ButtonWrapper = styled.div`
  & > button {
    padding-left: 0;
  }
`;

// BUG: breaks quill (menu is vertically aligned)
// const StyledCardBlock = styled(CardBlock)`
//   white-space: pre-line;
// `;

const GuidancePanel = ({
  isOpen,
  toggle,
  children,
  className,
  closeBtnText = 'Close',
  ...props
}) => (
  <Collapse
    {...{ isOpen, ...props }}
    className={cx('guidance-panel', className)}
  >
    <CardBlock>
      {children}
      <ButtonWrapper>
        <Button
          color="link"
          onClick={toggle}
        >
          {closeBtnText}
        </Button>
      </ButtonWrapper>
    </CardBlock>
  </Collapse>
);

GuidancePanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node,
  closeBtnText: PropTypes.string,
};

export default GuidancePanel;
