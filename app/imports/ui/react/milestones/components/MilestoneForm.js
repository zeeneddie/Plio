import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { InputGroup, InputGroupAddon, Input, Label } from 'reactstrap';
import styled from 'styled-components';

import {
  FormField,
  CardBlock,
  InputField,
  TextareaField,
  DatePickerField,
} from '../../components';
import MilestoneSymbol from './MilestoneSymbol';
import { MilestoneStatuses } from '../../../../share/constants';

const StyledLabel = styled(Label)`
  display: flex;
  align-items: center;
`;

const StyledSpan = styled.span`
  margin-left: 10px;
`;

const MilestoneForm = ({
  onChangeTitle,
  onChangeDescription,
  linkedTo,
  onChangeCompletionTargetDate,
  isCompleted,
  onChangeCompletedAt,
  onChangeCompletionComment,
  status,
  color,
}) => (
  <CardBlock>
    <FormField>
      Title
      <InputField
        name="title"
        placeholder="Title"
        onBlur={onChangeTitle}
      />
    </FormField>
    <FormField>
      Description
      <TextareaField
        name="description"
        placeholder="Description"
        onBlur={onChangeDescription}
      />
    </FormField>
    <FormField>
      Linked to
      <InputGroup>
        <InputGroupAddon>
          {linkedTo.sequentialId}
        </InputGroupAddon>
        <Input disabled value={linkedTo.title} />
      </InputGroup>
    </FormField>
    {!!status && (
      <FormField>
        {null}
        <StyledLabel>
          <MilestoneSymbol {...{ status, color }} />
          <StyledSpan>{MilestoneStatuses[status]}</StyledSpan>
        </StyledLabel>
      </FormField>
    )}
    <FormField>
      Completion - target date
      <DatePickerField
        name="completionTargetDate"
        disabled={isCompleted}
        onChange={onChangeCompletionTargetDate}
        placeholderText="Completion - target date"
      />
    </FormField>
    {isCompleted && (
      <Fragment>
        <FormField>
          Completed on
          <DatePickerField
            name="completedAt"
            onChange={onChangeCompletedAt}
            placeholderText="Completed on"
          />
        </FormField>
        <FormField>
          Comments
          <TextareaField
            name="completionComment"
            onBlur={onChangeCompletionComment}
            placeholder="Comments"
          />
        </FormField>
      </Fragment>
    )}
  </CardBlock>
);

MilestoneForm.propTypes = {
  onChangeTitle: PropTypes.func,
  onChangeDescription: PropTypes.func,
  linkedTo: PropTypes.shape({
    title: PropTypes.string,
    sequentialId: PropTypes.string,
  }).isRequired,
  onChangeCompletionTargetDate: PropTypes.func,
  isCompleted: PropTypes.bool,
  onChangeCompletedAt: PropTypes.func,
  onChangeCompletionComment: PropTypes.func,
  status: PropTypes.number,
  color: PropTypes.string,
};

export default MilestoneForm;
