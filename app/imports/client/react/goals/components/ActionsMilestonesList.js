import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Collapse, Button } from 'reactstrap';
import { StyledMixins } from 'plio-util';

import { ToggleAngleIcon } from '../../components';
import { TimelineListItem } from '../../components/timeline';
import { Styles } from '../../../../api/constants';

const ToggleButtonWrapper = styled.div`
  text-align: center;
  font-family: ${Styles.font.family.segoe.semibold};
  font-size: 16px;
  & > span {
    cursor: pointer;
    & > i {
      margin-left: 4px;
    }
  }
`;

const ActionPanel = styled.div`
  .btn {
    padding: 0;
    margin-right: 15px;
    text-decoration: none;
    max-width: none;
    font: inherit;
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
