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

const GoalsChartActionsList = ({ onEdit, onDelete }) => (
  <StyledListGroup>
    <ListGroupItem tag="a" action>
      <Icon name="check-square-o" margin="right" />
      Mark as Complete
    </ListGroupItem>
    <ListGroupItem tag="a" onClick={onEdit} action>
      <Icon name="edit" margin="right" />
      Edit
    </ListGroupItem>
    <ListGroupItem tag="a" onClick={onDelete} action>
      <Icon name="trash-o" margin="right" />
      Delete
    </ListGroupItem>
  </StyledListGroup>
);

GoalsChartActionsList.propTypes = {
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default GoalsChartActionsList;
