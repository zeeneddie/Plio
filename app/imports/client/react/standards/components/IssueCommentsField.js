import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Collapse } from 'reactstrap';
import { Field } from 'react-final-form';

import { StringLimits, IssueNumberRange } from '../../../../share/constants';
import {
  FormField,
  TextareaField,
  InputField,
} from '../../components';

const NumberField = styled(InputField)`
  max-width: 75px;
`;

const IssueCommentsField = ({ issueNumber, save }) => {
  const [state, setState] = useState({
    isOpen: false,
    issueNumber,
  });
  return (
    <Field name="issueComments" subscription={{ value: true }}>
      {({
        input: {
          value: issueComments,
          onChange: onChangeIssueComments,
        },
      }) => (
        <Fragment>
          <FormField>
            Issue number
            <NumberField
              name="issueNumber"
              type="number"
              min={state.issueNumber || IssueNumberRange.MIN}
              max={IssueNumberRange.MAX}
              onBlur={() => {
                if (issueNumber > state.issueNumber) {
                  setState({
                    isOpen: true,
                    issueNumber,
                  });
                  onChangeIssueComments('');
                }
                save();
              }}
              clearable={false}
            />
          </FormField>
          <Collapse isOpen={!!issueComments || state.isOpen}>
            <FormField>
              {' '}
              <TextareaField
                name="issueComments"
                placeholder={'Please indicate the key changes made ' +
                'since the last issue of this Standard'}
                onBlur={save}
                maxLength={StringLimits.comments.max}
                rows={4}
              />
            </FormField>
          </Collapse>
        </Fragment>
      )}
    </Field>
  );
};

IssueCommentsField.propTypes = {
  save: PropTypes.func,
  issueNumber: PropTypes.number,
};

export default props => (
  <Field
    name="issueNumber"
    subscription={{ value: true }}
    render={({ input: { value: issueNumber } }) =>
      issueNumber && <IssueCommentsField {...{ issueNumber, ...props }} />}
  />
);
