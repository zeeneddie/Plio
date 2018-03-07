import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Point } from 'victory';
import { compose, withProps } from 'recompose';
import { Popover } from 'reactstrap';
import withStateToggle from '../helpers/withStateToggle';

const StyledPopover = styled(Popover)`
  border-radius: 0;
  border: none;
  padding: 0;
  background-color: transparent;
  font-size: inherit;
  top: 10px !important;
`;

const enhance = compose(
  withStateToggle(false, 'isOpen', 'togglePopover'),
  withProps(({ id, index }) => ({
    pointId: `point-${id}-${index}`,
  })),
);

const PopoverPoint = ({
  renderPopoverContent,
  isOpen,
  pointId,
  togglePopover,
  ...props
}) => (
  <g>
    <g id={pointId} onClick={togglePopover}>
      <Point {...props} />
    </g>

    <foreignObject {...props}>
      <StyledPopover
        placement="bottom"
        isOpen={isOpen}
        target={pointId}
        toggle={togglePopover}
      >
        {isOpen && renderPopoverContent({ togglePopover })}
      </StyledPopover>
    </foreignObject>
  </g>
);

PopoverPoint.propTypes = {
  renderPopoverContent: PropTypes.func,
  isOpen: PropTypes.bool,
  pointId: PropTypes.string,
  togglePopover: PropTypes.func,
};

export default enhance(PopoverPoint);
