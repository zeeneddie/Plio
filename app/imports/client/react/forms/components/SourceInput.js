import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Button, TabContent, TabPane, Input } from 'reactstrap';
import { values } from 'ramda';

import { WithState } from '../../helpers';
import { Icon } from '../../components';
import SelectRadio from './SelectRadio';

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

const SourceInput = () => (
  <WithState initialState={{ type: attachmentTypes.ATTACHMENT.value }}>
    {({ state: { type }, setState }) => (
      <Fragment>
        <SelectRadio
          options={values(attachmentTypes)}
          value={type}
          onChange={({ value }) => setState({ type: value })}
        />
        <StyledTabContent activeTab={type}>
          <TabPane tabId={attachmentTypes.ATTACHMENT.value}>
            <Button type="file" color="primary">
              <Icon name="plus" /> Add
            </Button>
          </TabPane>
          <TabPane tabId={attachmentTypes.URL.value}>
            <Input placeholder="URL link" />
          </TabPane>
          <TabPane tabId={attachmentTypes.VIDEO.value}>
            <Input placeholder="YouTube or Vimeo URL" />
          </TabPane>
        </StyledTabContent>
      </Fragment>
    )}
  </WithState>
);

export default SourceInput;
