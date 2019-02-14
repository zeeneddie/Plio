import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Collapse } from 'reactstrap';
import { Field } from 'react-final-form';
import { OnBlur } from 'react-final-form-listeners';

import { parseInputValue } from '../../forms/helpers';
import { StringLimits, IssueNumberRange } from '../../../../share/constants';
import {
  FormField,
  TextareaAdapter,
  InputAdapter,
  FormInput,
} from '../../components';

const NumberAdapter = styled(InputAdapter)`
  max-width: 75px;
`;

const IssueCommentsField = ({ save }) => (
  <Field
    name="issueNumber"
    parse={value => parseInputValue({
      value,
      min: IssueNumberRange.MIN,
      max: IssueNumberRange.MAX,
      type: 'number',
    })}
    render={({
      input: issueNumberInput,
      meta: issueNumberMeta,
      ...restIssueNumber
    }) => issueNumberInput.value && (
      <Fragment>
        <FormField>
          Issue number
          <NumberAdapter
            {...restIssueNumber}
            type="number"
            component={FormInput}
            input={issueNumberInput}
            meta={issueNumberMeta}
            onBlur={save}
            clearable={false}
          />
        </FormField>
        <Field name="issueComments">
          {({
            input: issueCommentsInput,
            ...restIssueComments
          }) => (
            <Collapse
              isOpen={
                !!issueCommentsInput.value || issueNumberInput.value !== issueNumberMeta.initial
              }
            >
              <OnBlur name="issueNumber">
                {() => issueCommentsInput.onChange('')}
              </OnBlur>
              <FormField>
                {' '}
                <TextareaAdapter
                  {...restIssueComments}
                  name="issueComments"
                  placeholder={'Please indicate the key changes made ' +
                    'since the last issue of this Standard'}
                  input={issueCommentsInput}
                  onBlur={save}
                  maxLength={StringLimits.comments.max}
                  rows={4}
                />
              </FormField>
            </Collapse>
          )}
        </Field>
      </Fragment>
    )}
  />
);

IssueCommentsField.propTypes = {
  save: PropTypes.func,
  issueNumber: PropTypes.number,
  initialIssueNumber: PropTypes.number,
};

export default IssueCommentsField;
