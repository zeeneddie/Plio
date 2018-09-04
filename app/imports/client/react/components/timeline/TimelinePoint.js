import React from 'react';
import PropTypes from 'prop-types';
import { Point } from 'victory';
import { compose, withProps, withHandlers } from 'recompose';
import { omit } from 'ramda';
import { pathHelpers } from './helpers';
import withStateToggle from '../../helpers/withStateToggle';
import { StylessPopover } from '../../components';

const enhance = compose(
  withStateToggle(false, 'isOpen', 'togglePopover'),
  withProps(({
    id,
    index,
    symbol,
    datum: { renderPopover },
  }) => {
    const getPath = pathHelpers[symbol];
    return {
      renderPopover,
      getPath,
      pointId: `point-${id}-${index}`,
      symbol: !getPath ? symbol : null,
    };
  }),
  withHandlers({
    onClick: ({
      id,
      onClick,
      renderPopover,
      togglePopover,
    }) => () => renderPopover ? togglePopover() : onClick(id),
  }),
);

const TimelinePoint = ({
  pointId,
  isOpen,
  togglePopover,
  renderPopover,
  onClick,
  ...props
}) => (
  <g>
    <g id={pointId} {...{ onClick }}>
      <Point {...props} />
    </g>

    {renderPopover && (
      <foreignObject {...omit(['getPath'], props)}>
        <StylessPopover
          placement="bottom"
          isOpen={isOpen}
          target={pointId}
          toggle={togglePopover}
        >
          {isOpen && renderPopover({ togglePopover })}
        </StylessPopover>
      </foreignObject>
    )}
  </g>
);

TimelinePoint.propTypes = {
  renderPopover: PropTypes.func,
  isOpen: PropTypes.bool,
  pointId: PropTypes.string,
  togglePopover: PropTypes.func,
  onClick: PropTypes.func,
};

export default enhance(TimelinePoint);
