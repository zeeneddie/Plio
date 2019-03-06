import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { TabContent, TabPane } from 'reactstrap';
import { Form } from 'react-final-form';

import { AWSDirectives } from '../../../../share/constants';
import { FileTypes } from '../../../../api/constants';
import { onAfterSourceUpload } from '../../standards/helpers';
import { WithState } from '../../helpers';
import { SelectRadio } from '../../components';
import UrlField from '../../forms/components/UrlField';
import FileField from './FileField';
import FileCreateField from './FileCreateField';

const FileTypeOptions = [
  {
    value: FileTypes.ATTACHMENT,
    label: 'Attachment',
  },
  {
    value: FileTypes.URL,
    label: 'URL link',
  },
  {
    value: FileTypes.VIDEO,
    label: 'Video',
  },
];

const StyledTabContent = styled(TabContent)`
  margin-top: 7px;
`;

const SourceInput = ({
  value: source,
  organizationId,
  standardId,
  onChange,
  isEditMode,
}) => (
  <WithState initialState={{ type: source && source.type || FileTypes.ATTACHMENT }}>
    {({ state: { type }, setState }) => (
      <Form
        initialValues={source && {
          file: source.type === FileTypes.ATTACHMENT ? source.file : undefined,
          fileId: source.type === FileTypes.ATTACHMENT ? source.fileId : undefined,
          url: source.type === FileTypes.URL ? source.url : undefined,
          videoUrl: source.type === FileTypes.VIDEO ? source.url : undefined,
        }}
        onSubmit={({
          file,
          fileId,
          url,
          videoUrl,
        }) => {
          if (onChange) {
            onChange({
              type,
              fileId,
              file,
              url: type === FileTypes.URL ? url : videoUrl,
            });
          }
        }}
      >
        {({ handleSubmit }) => (
          <Fragment>
            <SelectRadio
              options={FileTypeOptions}
              value={type}
              onChange={({ value }) => setState({ type: value })}
            />
            <StyledTabContent activeTab={type}>
              <TabPane tabId={FileTypes.ATTACHMENT}>
                {isEditMode ? (
                  <FileField
                    name="fileId"
                    onChange={handleSubmit}
                    onAfterUpload={onAfterSourceUpload}
                    slingshotDirective={AWSDirectives.STANDARD_FILES}
                    slingshotContext={{
                      organizationId,
                      standardId,
                    }}
                  />
                ) : (
                  <FileCreateField
                    name="file"
                    upload={false}
                    onChange={handleSubmit}
                  />
                )}
              </TabPane>
              <TabPane tabId={FileTypes.URL}>
                <UrlField
                  name="url"
                  placeholder="URL link"
                  onBlur={handleSubmit}
                />
              </TabPane>
              <TabPane tabId={FileTypes.VIDEO}>
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
  organizationId: PropTypes.string,
  standardId: PropTypes.string,
  onChange: PropTypes.func,
  isEditMode: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
};

export default SourceInput;
