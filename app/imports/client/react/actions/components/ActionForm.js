import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Field } from 'react-final-form';

import {
  FormField,
  CardBlock,
  TextareaAdapter,
  InputField,
} from '../../components';
import { UserSelectInput } from '../../forms/components';
import ActionCompletionForm from './ActionCompletionForm';
import { StringLimits } from '../../../../share/constants';
// import ActionPlan from './ActionPlan';

const ActionForm = ({
  children,
  sequentialId,
  organizationId,
  onChangeTitle,
  onChangeDescription,
  onChangeOwner,
  // onChangePlanInPlace,
  ...props
}) => (
  <Fragment>
    <CardBlock>
      <FormField>
        Title
        <InputField
          name="title"
          onBlur={onChangeTitle}
          placeholder="Title"
          addon={sequentialId}
          maxLength={StringLimits.longTitle.max}
        />
      </FormField>
      <FormField>
        Description
        <Field
          name="description"
          onBlur={onChangeDescription}
          placeholder="Description"
          component={TextareaAdapter}
        />
      </FormField>
      {children}
      <FormField>
        Owner
        <UserSelectInput
          name="owner"
          placeholder="Owner"
          onChange={onChangeOwner}
          {...{ organizationId }}
        />
      </FormField>
      {/* <FormField>
        Plan in place?
        <Field
          name="planInPlace"
          onChange={onChangePlanInPlace}
          render={ActionPlan}
        />
      </FormField> */}
    </CardBlock>
    <CardBlock>
      <ActionCompletionForm {...{ ...props, organizationId }} />
    </CardBlock>
  </Fragment>
);

ActionForm.propTypes = {
  children: PropTypes.node,
  sequentialId: PropTypes.string,
  organizationId: PropTypes.string,
  onChangeTitle: PropTypes.func,
  onChangeDescription: PropTypes.func,
  onChangeOwner: PropTypes.func,
  // onChangePlanInPlace: PropTypes.func,
  onChangeCompletionTargetDate: PropTypes.func,
  onChangeToBeCompletedBy: PropTypes.func,
};

export default ActionForm;
