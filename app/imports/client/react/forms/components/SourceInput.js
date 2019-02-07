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

const AttachmentTypes = {
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

const SourceInput = ({
  value: source = {},
  onChange,
  onRemove,
  isEditMode,
}) => (
  <WithState initialState={{ type: source.type || AttachmentTypes.ATTACHMENT.value }}>
    {({ state: { type }, setState }) => (
      <Form
        initialValues={{
          file: source.file,
          url: source.type === AttachmentTypes.URL.value ? source.url : undefined,
          videoUrl: source.type === AttachmentTypes.VIDEO.value ? source.url : undefined,
        }}
        onSubmit={({ file, url, videoUrl }) => {
          if (onChange) {
            onChange({
              type,
              file,
              url: type === AttachmentTypes.URL.value ? url : videoUrl,
            });
          }
        }}
      >
        {({ handleSubmit }) => (
          <Fragment>
            <SelectRadio
              options={valuesR(AttachmentTypes)}
              value={type}
              onChange={({ value }) => setState({ type: value })}
            />
            <StyledTabContent activeTab={type}>
              <TabPane tabId={AttachmentTypes.ATTACHMENT.value}>
                <FileField
                  {...{ onRemove }}
                  name="file"
                  onChange={handleSubmit}
                />
                {!isEditMode && (
                  <Field name="file" subscription={{ value: true }}>
                    {({ input: { value } }) => value && (
                      value.name.split('.').pop().toLowerCase() === 'docx' ? (
                        <p>
                          File will be uploaded and rendered as HTML
                          when you click on the Save button
                        </p>
                      ) : (
                        <p>File will be uploaded when you click on the Save button</p>
                      )
                    )}
                  </Field>
                )}
              </TabPane>
              <TabPane tabId={AttachmentTypes.URL.value}>
                <UrlField
                  name="url"
                  placeholder="URL link"
                  onBlur={handleSubmit}
                />
              </TabPane>
              <TabPane tabId={AttachmentTypes.VIDEO.value}>
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
  onRemove: PropTypes.func,
  isEditMode: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
};

export default SourceInput;
