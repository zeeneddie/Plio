import React from 'react';
import PropTypes from 'prop-types';
import { compose, withProps, withHandlers, branch, pure } from 'recompose';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import styled from 'styled-components';

import { getFormattedDate } from '../../../../share/helpers';
import { withToggle } from '../../helpers';
import Label from '../../components/Labels/Label';

const StyledDropdownMenu = styled(DropdownMenu)`
  top: 10px !important;
`;

const enhance = compose(
  pure,
  withProps(({
    canRestore,
    deletedAt,
    completedAt,
    isDeleted,
  }) => ({
    date: isDeleted ? deletedAt : completedAt,
    statusText: isDeleted ? 'deleted' : 'completed',
    canRestore: canRestore({ isDeleted, completedAt }),
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
  withToggle(),
);

const DashboardDeletedItem = ({
  sequentialId,
  title,
  date,
  statusText,
  onRestore,
  onRemove,
  canRestore,
  isOpen,
  toggle,
}) => (
  <Dropdown {...{ isOpen, toggle }} className="dashboard-stats-action">
    <DropdownToggle tag="div">
      <Label>{sequentialId}</Label>
      {title}
      <span className="text-muted"> ({statusText} {getFormattedDate(date)})</span>
    </DropdownToggle>
    <StyledDropdownMenu>
      <DropdownItem onClick={onRestore} disabled={!canRestore}>Restore key goal</DropdownItem>
      <DropdownItem onClick={onRemove}>Delete permanently</DropdownItem>
    </StyledDropdownMenu>
  </Dropdown>
);

DashboardDeletedItem.propTypes = {
  sequentialId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  statusText: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  date: PropTypes.number.isRequired,
  canRestore: PropTypes.bool.isRequired,
  onRestore: PropTypes.func,
  onRemove: PropTypes.func,
};

export default enhance(DashboardDeletedItem);
