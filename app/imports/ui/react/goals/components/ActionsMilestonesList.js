import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Collapse, Button } from 'reactstrap';
import { StyledMixins } from 'plio-util';

import { TimelineListItem, ToggleAngleIcon } from '../../components';

const ToggleButtonWrapper = styled.div`
  text-align: center;
  font-weight: 1000;
  span {
    cursor: pointer;
  }
`;

const ActionPanel = styled.div`
  .btn {
    padding: 0;
    margin-right: 15px;
    text-decoration: none;
    max-width: none;
    ${StyledMixins.media.mobile`
      display: block;
    `};
  }
`;

const ActionsMilestonesList = ({
  items,
  isOpen,
  toggle,
  title,
  onEditGoal,
  onAddAction,
  onAddMilestone,
}) => (
  <Fragment>
    <ToggleButtonWrapper>
      <span onClick={toggle}>
        {title} <ToggleAngleIcon {...{ isOpen }} />
      </span>
    </ToggleButtonWrapper>

    <Collapse {...{ isOpen }}>
      {items.map(item => (
        <TimelineListItem key={item.id} {...item} />
      ))}

      <ActionPanel>
        <Button color="link" onClick={onAddAction}>Add action</Button>
        <Button color="link" onClick={onAddMilestone}>Add milestone</Button>
        <Button color="link" onClick={onEditGoal}>Edit key goal</Button>
      </ActionPanel>
    </Collapse>
  </Fragment>
);

ActionsMilestonesList.propTypes = {
  items: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  onEditGoal: PropTypes.func,
  onAddAction: PropTypes.func,
  onAddMilestone: PropTypes.func,
  isOpen: PropTypes.bool,
  toggle: PropTypes.func,
};

export default ActionsMilestonesList;
