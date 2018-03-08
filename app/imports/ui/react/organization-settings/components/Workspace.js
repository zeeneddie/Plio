import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'recompose';
import { CardTitle } from 'reactstrap';
import { OrganizationSettingsHelp } from '../../../../api/help-messages';
import { equals } from '../../../../api/helpers';
import HomeScreenTitle from '../fields/edit/components/HomeScreenTitle';
import {
  StandardTitles,
  RiskTitles,
  NonConformitiesTitles,
  WorkInboxTitles,
  WorkspaceDefaultsTypes,
} from '../../../../share/constants';
import { withStateToggle } from '../../helpers';
import { createWorkspaceTitleValue } from '../helpers';
import { CardBlock, Subcard, SubcardHeader, SubcardBody, GuidancePanel, GuidanceIcon } from '../../components';
import WorkspaceDefaultsField from './WorkspaceDefaultsField';

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
  organization: { homeScreenTitles: titles = {}, workspaceDefaults } = {},
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

          <WorkspaceDefaultsField
            label="Users online"
            value={workspaceDefaults[WorkspaceDefaultsTypes.DISPLAY_USERS]}
            valueKey={WorkspaceDefaultsTypes.DISPLAY_USERS}
            onChange={changeWorkspaceDefaults}
          />

          <WorkspaceDefaultsField
            label="Unread messages"
            value={workspaceDefaults[WorkspaceDefaultsTypes.DISPLAY_MESSAGES]}
            valueKey={WorkspaceDefaultsTypes.DISPLAY_MESSAGES}
            onChange={changeWorkspaceDefaults}
          />

          <WorkspaceDefaultsField
            label="Overdue actions"
            value={workspaceDefaults[WorkspaceDefaultsTypes.DISPLAY_ACTIONS]}
            valueKey={WorkspaceDefaultsTypes.DISPLAY_ACTIONS}
            onChange={changeWorkspaceDefaults}
          />

          <legend>Workspace titles</legend>

          {workspaceTitlesFields}
        </CardBlock>

        <GuidanceIcon onClick={toggleGuidancePanel} />
        <GuidancePanel
          isOpen={isGuidancePanelOpen}
          toggle={toggleGuidancePanel}
        >
          {OrganizationSettingsHelp.homeScreenTitles}
        </GuidancePanel>
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
