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
}) => (
  <StyledListGroup>
    {onComplete && (
      <ListGroupItem tag="a" onClick={onComplete} action>
        <Icon name="check-square-o" margin="right" />
        Mark as Complete
      </ListGroupItem>
    )}

    {onEdit && (
      <ListGroupItem tag="a" onClick={onEdit} action>
        <Icon name="edit" margin="right" />
        Edit
      </ListGroupItem>
    )}

    {onDelete && (
      <ListGroupItem tag="a" onClick={onDelete} action>
        <Icon name="trash-o" margin="right" />
        Delete
      </ListGroupItem>
    )}
  </StyledListGroup>
);

ChartActions.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onComplete: PropTypes.func,
};

export default ChartActions;
