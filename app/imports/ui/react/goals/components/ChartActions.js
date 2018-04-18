import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ListGroup, ListGroupItem } from 'reactstrap';

import Icon from '../../components/Icons/Icon';

const StyledListGroup = styled(ListGroup)`
  border: 1px solid #ddd;
  border-radius: .25rem;
  .list-group-item {
    border: none;
  }
`;

const ChartActions = ({
  onEdit,
  onDelete,
  onComplete,
  editLabel = 'Edit',
  completeLabel = 'Mark as Complete',
  deleteLabel = 'Delete',
}) => (
  <StyledListGroup>
    {onComplete && (
      <ListGroupItem tag="a" onClick={onComplete} action>
        <Icon name="check-square-o" margin="right" />
        {completeLabel}
      </ListGroupItem>
    )}

    {onEdit && (
      <ListGroupItem tag="a" onClick={onEdit} action>
        <Icon name="edit" margin="right" />
        {editLabel}
      </ListGroupItem>
    )}

    {onDelete && (
      <ListGroupItem tag="a" onClick={onDelete} action>
        <Icon name="trash-o" margin="right" />
        {deleteLabel}
      </ListGroupItem>
    )}
  </StyledListGroup>
);

ChartActions.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onComplete: PropTypes.func,
  editLabel: PropTypes.string,
  completeLabel: PropTypes.string,
  deleteLabel: PropTypes.string,
};

export default ChartActions;
