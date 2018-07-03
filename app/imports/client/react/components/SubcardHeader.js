import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import styled from 'styled-components';

import CardBlock from './CardBlock';

const StyledCardBlock = styled(CardBlock)`
  & > span {
    max-width: 100%;
    word-wrap: break-word;
  }
`;

const SubcardHeader = ({
  children,
  className,
  isOpen,
  isNew,
  error,
  ...props
}) => (
  <StyledCardBlock
    className={cx(
      'card-block-collapse-toggle',
      className,
      {
        'with-error': error,
        new: isNew,
        collapsed: !isOpen,
      },
    )}
    {...props}
  >
    {children}
  </StyledCardBlock>
);

SubcardHeader.propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  className: PropTypes.string,
  isNew: PropTypes.bool,
  error: PropTypes.bool,
};

export default SubcardHeader;
