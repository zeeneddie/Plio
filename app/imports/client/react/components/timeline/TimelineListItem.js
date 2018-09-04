import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment-timezone';
import { compose, withProps } from 'recompose';
import { Rect, Diamond, StylessPopover, Icon } from '../../components';
import { Timeline, SymbolTypes } from '../../../../api/constants';
import withStateToggle from '../../helpers/withStateToggle';

const Wrapper = styled.div`
  margin: 10px 0;
`;

const ListItemWrapper = styled.span`
  cursor: pointer;
  padding-left: 2px;
  &:hover {
    color: #0275d8
  }
  & > div {
    margin-right: 8px;
  }
`;

const enhance = compose(
  withStateToggle(false, 'isOpen', 'togglePopover'),
  withProps(({ fill, id }) => ({
    iconProps: {
      size: Timeline.LIST_ICON_SIZE,
      inline: true,
      id: `item-${id}`,
      fill,
    },
  })),
);

const TimelineListItem = ({
  label,
  date,
  userName,
  symbol,
  isOpen,
  iconProps,
  togglePopover,
  renderPopover,
}) => (
  <Wrapper>
    <ListItemWrapper onClick={togglePopover}>
      {symbol === SymbolTypes.SQUARE && <Rect {...iconProps} />}
      {symbol === SymbolTypes.DIAMOND && <Diamond {...iconProps} />}
      {label}
      <span className="text-muted">
        {userName ? ` ${userName}, ` : ' '}
        {moment(date).format('D MMM YYYY ')}
      </span>
      <Icon name="angle-down" margin="left" />
    </ListItemWrapper>
    {renderPopover && (
      <StylessPopover
        placement="bottom-start"
        isOpen={isOpen}
        target={iconProps.id}
        toggle={togglePopover}
      >
        {isOpen && renderPopover({ togglePopover })}
      </StylessPopover>
    )}
  </Wrapper>
);

TimelineListItem.propTypes = {
  label: PropTypes.string.isRequired,
  date: PropTypes.object.isRequired,
  symbol: PropTypes.string.isRequired,
  userName: PropTypes.string,
  iconProps: PropTypes.object,
  isOpen: PropTypes.bool,
  togglePopover: PropTypes.func,
  renderPopover: PropTypes.func,
};

export default enhance(TimelineListItem);
