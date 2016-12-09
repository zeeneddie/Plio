import React, { PropTypes } from 'react';
import { OrganizationSettingsHelp } from '/imports/api/help-messages';
import Subcard from '../../../components/Subcard';
import Form from '/imports/ui/react/forms/components/Form';
import TitleSelect from '../TitleSelect';

import {
  StandardTitles,
  RiskTitles,
  NonConformitieTitles,
  WorkInboxTitles,
} from '/imports/api/constants';


const HomeTitlesSubcard = ({
  loading,
  onFieldChangeHandler,
  organization: { homeScreenTitles: titles },
  isHelpOpened,
  setIsHelpOpened,
  ...other,
}) => (
  <Subcard loading={loading} {...other}>
    <Subcard.Title>
      <Subcard.TitleItem pull="left">
        Home screen titles
      </Subcard.TitleItem>
    </Subcard.Title>

    <Subcard.Content>
      <Form autosave onFormChange={onFieldChangeHandler}>
        <TitleSelect
          name="standards"
          label="Standards"
          items={StandardTitles}
          selected={titles.standards}
        />

        <TitleSelect
          name="risks"
          label="Risk register"
          items={RiskTitles}
          selected={titles.risks}
        />

        <TitleSelect
          name="noconformities"
          label="Non-conformities"
          items={NonConformitieTitles}
          selected={titles.nonConformities}
        />

        <TitleSelect
          name="workInbox"
          label="Work inbox"
          items={WorkInboxTitles}
          selected={titles.workInbox}
        />
      </Form>
    </Subcard.Content>

    <Subcard.Help collapsed={isHelpOpened} setCollapsed={setIsHelpOpened} >
      {OrganizationSettingsHelp.homeScreenTitles}
    </Subcard.Help>
  </Subcard>
);

HomeTitlesSubcard.propTypes = {
  loading: PropTypes.bool,
  onFieldChangeHandler: PropTypes.func,
  organization: PropTypes.object,
  isHelpOpened: PropTypes.bool,
  setIsHelpOpened: PropTypes.func,
};

export default HomeTitlesSubcard;
