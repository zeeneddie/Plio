import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

import { StringLimits } from '../../../../share/constants';
import {
  CardBlock,
  FormField,
  DatePickerField,
  TextareaField,
} from '../../components';
import { UserSelectInput } from '../../forms/components';

const ReviewForm = ({ organizationId, save }) => (
  <Fragment>
    <CardBlock>
      <FormField>
        Scheduled review date
        <DatePickerField name="scheduledDate" onChange={save} />
      </FormField>
      <FormField>
        Actual review date
        <DatePickerField name="reviewedAt" onChange={save} />
      </FormField>
      <FormField>
        Reviewed by
        <UserSelectInput
          name="reviewedBy"
          placeholder="Reviewed by"
          onChange={save}
          {...{ organizationId }}
        />
      </FormField>
      <FormField>
        Comments
        <TextareaField
          name="comments"
          placeholder="Description"
          maxLength={StringLimits.comments.max}
          onBlur={save}
        />
      </FormField>
    </CardBlock>
  </Fragment>
);

ReviewForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  save: PropTypes.func,
};

export default ReviewForm;
