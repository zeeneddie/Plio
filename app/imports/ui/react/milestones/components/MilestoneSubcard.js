import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { EntitySubcard } from '../../components';
import { getFormattedDate } from '../../../../share/helpers';
import MilestoneForm from './MilestoneForm';
import MilestoneSymbol from './MilestoneSymbol';

const StyledHeader = styled.div`
  display: flex;
  justify-content: space-between;
  & > div:nth-child(2) {
    display: flex;
    align-items: center;
    & > div:nth-child(1) {
      margin-right: 10px;
    }
  }
`;

const MilestoneSubcard = ({
  milestone,
  isOpen,
  toggle,
  onDelete,
  onClose,
  error,
  loading,
  linkedTo,
  color,
  onChangeTitle,
  onChangeDescription,
  onChangeCompletionTargetDate,
}) => (
  <EntitySubcard
    entity={milestone}
    header={() => (
      <StyledHeader>
        <div>{milestone.title}</div>
        <div className="hidden-xs-down">
          <div>
            {getFormattedDate(milestone.completionTargetDate)}
          </div>
          <MilestoneSymbol status={milestone.status} {...{ color }} />
        </div>
      </StyledHeader>
    )}
    {...{
      isOpen,
      toggle,
      loading,
      onDelete,
      onClose,
      error,
    }}
  >
    <MilestoneForm
      status={milestone.status}
      {...{
        linkedTo,
        onChangeTitle,
        onChangeDescription,
        onChangeCompletionTargetDate,
        color,
      }}
    />
  </EntitySubcard>
);

MilestoneSubcard.propTypes = {
  milestone: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  loading: PropTypes.bool,
  error: PropTypes.string,
  linkedTo: PropTypes.object.isRequired,
  color: PropTypes.string,
  onChangeTitle: PropTypes.func.isRequired,
  onChangeDescription: PropTypes.func.isRequired,
  onChangeCompletionTargetDate: PropTypes.func.isRequired,
};

export default MilestoneSubcard;
