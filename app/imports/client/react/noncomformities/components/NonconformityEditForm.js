import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { pure } from 'recompose';
import { noop } from 'plio-util';
import { Field } from 'react-final-form';
import { Row } from 'reactstrap';

import {
  FormField,
  InputField,
  TextareaField,
  Magnitudes,
  SelectField,
  UserSelectInput,
  Status,
  Col,
  StandardSelectInput,
  CategorizeField,
} from '../../components';
import { NonConformitiesHelp } from '../../../../api/help-messages';
import { getStatusColor } from '../helpers';
import { StringLimits, ProblemsStatuses, ProblemTypes } from '../../../../share/constants';

export const NonconformityEditForm = ({
  organizationId,
  type,
  guidelines,
  save = noop,
  currency,
}) => (
  <Fragment>
    <FormField>
      Title
      <Field name="sequentialId" subscription={{ value: true }}>
        {({ input: { value: sequentialId } }) => (
          <InputField
            name="title"
            placeholder="Title"
            onBlur={save}
            addon={sequentialId}
            maxLength={StringLimits.title.max}
            autoFocus
          />
        )}
      </Field>
    </FormField>
    <FormField>
      Description
      <TextareaField
        name="description"
        placeholder="Description"
        onBlur={save}
        maxLength={StringLimits.description.max}
      />
    </FormField>
    <FormField>
      Status
      <Field name="status" subscription={{ value: true }}>
        {({ input: { value: status } }) => (
          <Status color={getStatusColor(status)}>
            {ProblemsStatuses[status]}
          </Status>
        )}
      </Field>
    </FormField>
    <FormField>
      Status comment
      <TextareaField
        name="statusComment"
        placeholder="Status comment"
        onBlur={save}
        maxLength={StringLimits.description.max}
      />
    </FormField>
    <FormField>
      Standard(s)
      <StandardSelectInput
        multi
        name="standards"
        placeholder="Link to standard(s)"
        onChange={save}
        {...{ organizationId }}
      />
    </FormField>
    <hr />
    <FormField>
      Categorize
      <CategorizeField
        name="categorize"
        placeholder="Add category"
        onChange={save}
        {...{ organizationId }}
      />
    </FormField>
    <FormField>
      Originator
      <UserSelectInput
        {...{ organizationId }}
        name="originator"
        placeholder="Originator"
        onChange={save}
      />
    </FormField>
    <FormField>
      Owner
      <UserSelectInput
        {...{ organizationId }}
        name="owner"
        placeholder="Owner"
        onChange={save}
      />
    </FormField>
    <Magnitudes label="Magnitude" {...{ guidelines }}>
      <Magnitudes.Select disabled name="magnitude" component={SelectField} />
    </Magnitudes>
    <FormField guidance={NonConformitiesHelp.costPerOccurance}>
      Financial impact
      <InputField
        name="cost"
        type="number"
        placeholder="Financial impact"
        onBlur={save}
        addon={currency}
      />
    </FormField>
    {type === ProblemTypes.NON_CONFORMITY && (
      <FormField>
        Help desk ref
        <Row>
          <Col sm={4}>
            <InputField
              name="ref.text"
              placeholder="ID"
              onBlur={save}
            />
          </Col>
          <Col sm={8}>
            <InputField
              name="ref.url"
              placeholder="URL"
              maxLength={StringLimits.url.max}
              onBlur={save}
            />
          </Col>
        </Row>
      </FormField>
    )}
    {/* TODO add root cause analysis */}
  </Fragment>
);

NonconformityEditForm.propTypes = {
  organizationId: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  save: PropTypes.func,
  // eslint-disable-next-line react/no-typos
  guidelines: Magnitudes.propTypes.guidelines,
  currency: PropTypes.string.isRequired,
};

export default pure(NonconformityEditForm);
