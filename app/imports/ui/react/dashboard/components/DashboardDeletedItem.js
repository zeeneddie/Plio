import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { compose, withProps, onlyUpdateForKeys, withHandlers, branch } from 'recompose';
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
  withProps(({ canRestore, ...restProps }) => ({
    date: restProps.isDeleted ? restProps.deletedAt : restProps.completedAt,
    statusText: restProps.isDeleted ? 'deleted' : 'completed',
    canRestore: canRestore(restProps),
  })),
  branch(
    ({ onRemove, onUndoCompletion, onRestore }) => onRemove && onUndoCompletion && onRestore,
    withHandlers({
      onRestore: ({
        _id,
        title,
        isDeleted,
        onUndoCompletion,
        onRestore,
      }) => () => isDeleted ? onRestore({ _id, title }) : onUndoCompletion({ _id, title }),
      onRemove: ({ _id, title, onRemove }) => () => onRemove({ _id, title }),
    }),
  ),
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
    {onRemove && onRestore && (
      <ButtonGroup size="sm">
        <Button onClick={onRemove}>Delete</Button>
        <Button disabled={!canRestore} onClick={onRestore}>Restore</Button>
      </ButtonGroup>
    )}
  </StyledDeletedGoal>
);

DashboardDeletedItem.propTypes = {
  sequentialId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  statusText: PropTypes.string.isRequired,
  date: PropTypes.number.isRequired,
  canRestore: PropTypes.bool.isRequired,
  onRestore: PropTypes.func,
  onRemove: PropTypes.func,
};

export default enhance(DashboardDeletedItem);
