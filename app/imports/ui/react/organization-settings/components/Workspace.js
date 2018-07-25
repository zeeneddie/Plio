import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { compose } from 'recompose';
import { CardTitle } from 'reactstrap';
import { noop, generateWorkspaceDefaultsOptions } from 'plio-util';
import { Form } from 'react-final-form';

import { OrganizationSettingsHelp } from '../../../../api/help-messages';
import { equals } from '../../../../api/helpers';
import HomeScreenTitle from '../fields/edit/components/HomeScreenTitle';
import {
  StandardTitles,
  RiskTitles,
  NonConformitiesTitles,
  WorkInboxTitles,
  WorkspaceDefaultsTypes,
  WorkspaceDefaultsLabels,
} from '../../../../share/constants';
import { withStateToggle } from '../../helpers';
import { createWorkspaceTitleValue } from '../helpers';
import {
  CardBlock,
  Subcard,
  SubcardHeader,
  SubcardBody,
  GuidancePanel,
  GuidanceIcon,
  SelectInputField,
  FormField,
  HelpInfo,
} from '../../components';

const ITEM_MAP = {
  standards: {
    label: 'Standards',
    items: StandardTitles,
  },
  risks: {
    label: 'Risk register',
    items: RiskTitles,
  },
  nonConformities: {
    label: 'Nonconformities',
    items: NonConformitiesTitles,
  },
  workInbox: {
    label: 'Work inbox',
    items: WorkInboxTitles,
  },
};

const enhance = compose(
  withStateToggle(false, 'isOpen', 'toggle'),
  withStateToggle(false, 'isGuidancePanelOpen', 'toggleGuidancePanel'),
);

const Workspace = enhance(({
  loading,
  isOpen,
  toggle,
  isGuidancePanelOpen,
  toggleGuidancePanel,
  changeWorkspaceDefaults,
  onSelectTitle: onSelect,
  organization: { homeScreenTitles: titles = {} } = {},
  initialValues,
}) => {
  const workspaceTitlesFields = Object.keys(ITEM_MAP).map((key) => {
    // we need a key for a method and a value to know which title is selected
    const currentItem = ITEM_MAP[key];
    const selectedTitle = titles[key];
    const newSelectedTitle = !!titles[key] && !currentItem.items.find(equals(selectedTitle))
      ? [{
        label: selectedTitle,
        value: createWorkspaceTitleValue(key, selectedTitle),
      }]
      : null;

    const items = currentItem.items.map(title => ({
      label: title,
      value: createWorkspaceTitleValue(key, title),
    })).concat(newSelectedTitle || []);

    return (
      <HomeScreenTitle
        {...{
          ...currentItem, key, items, onSelect,
        }}
        id={key}
        selected={createWorkspaceTitleValue(key, selectedTitle)}
      />
    );
  });

  return (
    <Subcard {...{ isOpen, toggle, loading }}>
      <SubcardHeader><CardTitle>Workspace</CardTitle></SubcardHeader>
      <SubcardBody>
        <CardBlock>
          <legend>Workspace defaults</legend>

          <Form
            onSubmit={noop}
            subscription={{}}
            {...{ initialValues }}
          >
            {() => (
              <Fragment>
                <FormField>
                  {WorkspaceDefaultsLabels[WorkspaceDefaultsTypes.DISPLAY_USERS]}
                  <SelectInputField
                    name={WorkspaceDefaultsTypes.DISPLAY_USERS}
                    options={generateWorkspaceDefaultsOptions()}
                    onChange={({ value }) => changeWorkspaceDefaults({
                      [WorkspaceDefaultsTypes.DISPLAY_USERS]: value,
                    })}
                  />
                </FormField>
                <FormField>
                  {WorkspaceDefaultsLabels[WorkspaceDefaultsTypes.DISPLAY_MESSAGES]}
                  <SelectInputField
                    name={WorkspaceDefaultsTypes.DISPLAY_MESSAGES}
                    options={generateWorkspaceDefaultsOptions()}
                    onChange={({ value }) => changeWorkspaceDefaults({
                      [WorkspaceDefaultsTypes.DISPLAY_MESSAGES]: value,
                    })}
                  />
                </FormField>
                <FormField>
                  {WorkspaceDefaultsLabels[WorkspaceDefaultsTypes.DISPLAY_ACTIONS]}
                  <SelectInputField
                    name={WorkspaceDefaultsTypes.DISPLAY_ACTIONS}
                    options={generateWorkspaceDefaultsOptions()}
                    onChange={({ value }) => changeWorkspaceDefaults({
                      [WorkspaceDefaultsTypes.DISPLAY_ACTIONS]: value,
                    })}
                  />
                </FormField>
              </Fragment>
            )}
          </Form>

          <legend>Workspace titles</legend>

          {workspaceTitlesFields}
        </CardBlock>

        <HelpInfo>
          <GuidanceIcon onClick={toggleGuidancePanel} />
          <GuidancePanel
            isOpen={isGuidancePanelOpen}
            toggle={toggleGuidancePanel}
          >
            {OrganizationSettingsHelp.homeScreenTitles}
          </GuidancePanel>
        </HelpInfo>
      </SubcardBody>
    </Subcard>
  );
});

Workspace.propTypes = {
  loading: PropTypes.bool,
  organization: PropTypes.object,
  onSelectTitle: PropTypes.func,
  changeWorkspaceDefaults: PropTypes.func,
};

export default Workspace;
