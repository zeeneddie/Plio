import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { reject, view } from 'ramda';
import { lenses } from 'plio-util';
import { withProps, compose, withHandlers } from 'recompose';
import { Collapse, Button } from 'reactstrap';
import { TimelineListItem, ToggleAngleIcon } from '../../components';
import withStateToggle from '../../helpers/withStateToggle';

const ToggleButtonWrapper = styled.div`
  text-align: center;
  font-weight: 1000;
  span {
    cursor: ${({ isClickable }) => isClickable ? 'pointer' : 'auto'};
  }
`;

const ActionPanel = styled.div`
  .btn {
    padding: 0;
    margin-right: 15px;
    text-decoration: none;
  }
`;

const enhance = compose(
  withStateToggle(false, 'isOpen', 'toggle'),
  withProps(({ goal }) => ({
    items: reject(view(lenses.isCompleted), goal.points),
    title: goal.title,
  })),
  withHandlers({
    onEditGoal: ({ onEditGoal, goal }) => () => onEditGoal(goal._id),
  }),
);

const ActionsMilestonesList = ({
  items,
  isOpen,
  toggle,
  title,
  onEditGoal,
}) => (
  <Fragment>
    <ToggleButtonWrapper isClickable={items.length}>
      <span onClick={toggle}>
        {title} {!!items.length && <ToggleAngleIcon {...{ isOpen }} />}
      </span>
    </ToggleButtonWrapper>

    <Collapse {...{ isOpen }}>
      {items.map(item => (
        <TimelineListItem key={item.id} {...item} />
      ))}

      <ActionPanel>
        <Button color="link">Add action</Button>
        <Button color="link">Add milestone</Button>
        <Button color="link" onClick={onEditGoal}>Edit key goal</Button>
      </ActionPanel>
    </Collapse>
  </Fragment>
);

ActionsMilestonesList.propTypes = {
  onEditGoal: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};

export default enhance(ActionsMilestonesList);
