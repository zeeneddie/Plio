import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose, withProps, onlyUpdateForKeys, withHandlers } from 'recompose';
import { Button, ButtonGroup } from 'reactstrap';
import { getFormattedDate } from '../../../../share/helpers';
import Label from '../../components/Labels/Label';

const StyledDeletedGoal = styled.div`
  cursor: inherit;
  .btn-group {
    position: relative;
    top: -2px;
    float: right;
    .btn.btn-secondary:first-child:not(:last-child) {
      padding-right: .75rem;
    }
  }
`;

const enhance = compose(
  onlyUpdateForKeys(['_id', 'isDeleted', 'completedAt', 'deletedAt', 'title', 'sequentialId']),
  withHandlers({
    onRestore: ({
      _id,
      isDeleted,
      onUndoCompletion,
      onRestore,
    }) => () => isDeleted ? onRestore(_id) : onUndoCompletion(_id),
    onRemove: ({ _id, title, onRemove }) => () => onRemove({ _id, title }),
  }),
  withProps(({ canRestore, ...props }) => ({
    date: props.isDeleted ? props.deletedAt : props.completedAt,
    statusText: props.isDeleted ? 'deleted' : 'completed',
    canRestore: canRestore(props),
  })),
);

const DashboardDeletedItem = ({
  sequentialId,
  title,
  date,
  statusText,
  onRestore,
  onRemove,
  canRestore,
}) => (
  <StyledDeletedGoal className="dashboard-stats-action">
    <Label>{sequentialId}</Label>
    {title}
    <span className="text-muted"> ({statusText} {getFormattedDate(date)})</span>
    <ButtonGroup size="sm">
      <Button onClick={onRemove}>Delete</Button>
      <Button disabled={!canRestore} onClick={onRestore}>Restore</Button>
    </ButtonGroup>
  </StyledDeletedGoal>
);

DashboardDeletedItem.propTypes = {
  sequentialId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  statusText: PropTypes.string.isRequired,
  date: PropTypes.number.isRequired,
  onRestore: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  canRestore: PropTypes.bool.isRequired,
};

export default enhance(DashboardDeletedItem);
