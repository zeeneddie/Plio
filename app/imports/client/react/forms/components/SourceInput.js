import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TabContent, TabPane } from 'reactstrap';
import { values as valuesR } from 'ramda';
import { Form, Field } from 'react-final-form';

import { WithState } from '../../helpers';
import SelectRadio from './SelectRadio';
import UrlField from './UrlField';
import FileField from './FileField';

const attachmentTypes = {
  ATTACHMENT: {
    value: 'attachment',
    label: 'Attachment',
  },
  URL: {
    value: 'url',
    label: 'URL link',
  },
  VIDEO: {
    value: 'video',
    label: 'Video',
  },
};

const StyledTabContent = styled(TabContent)`
  margin-top: 7px;
`;

const SourceInput = ({ onChange }) => (
  <WithState initialState={{ type: attachmentTypes.ATTACHMENT.value }}>
    {({ state: { type }, setState }) => (
      <Form
        onSubmit={({ file, url, videoUrl }) => {
          if (onChange) {
            onChange({
              type,
              file,
              url: type === attachmentTypes.URL.value ? url : videoUrl,
            });
          }
        }}
      >
        {({ handleSubmit }) => (
          <Fragment>
            <SelectRadio
              options={valuesR(attachmentTypes)}
              value={type}
              onChange={({ value }) => setState({ type: value })}
            />
            <StyledTabContent activeTab={type}>
              <TabPane tabId={attachmentTypes.ATTACHMENT.value}>
                <FileField
                  name="file"
                  onChange={handleSubmit}
                />
                <Field name="file" subscription={{ value: true }}>
                  {({ input: { value } }) => value && (
                    value.name.split('.').pop().toLowerCase() === 'docx' ? (
                      <p>
                        File will be uploaded and rendered as HTML when you click on the Save button
                      </p>
                    ) : (
                      <p>File will be uploaded when you click on the Save button</p>
                    )
                  )}
                </Field>
              </TabPane>
              <TabPane tabId={attachmentTypes.URL.value}>
                <UrlField
                  name="url"
                  placeholder="URL link"
                  onBlur={handleSubmit}
                />
              </TabPane>
              <TabPane tabId={attachmentTypes.VIDEO.value}>
                <UrlField
                  name="videoUrl"
                  placeholder="YouTube or Vimeo URL"
                  onBlur={handleSubmit}
                />
              </TabPane>
            </StyledTabContent>
          </Fragment>
        )}
      </Form>
    )}
  </WithState>
);

SourceInput.propTypes = {
  onChange: PropTypes.func,
};

export default SourceInput;
