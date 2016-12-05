import React, { PropTypes } from 'react';
import { OrganizationSettingsHelp } from '/imports/api/help-messages';
import Subcard from '../../components/Subcard';
import Select from '/imports/ui/react/forms/components/Select';

const standard = [
  'Standards',
  'Compliance standards',
  'Compliance manual',
  'Quality standards',
  'Quality manual',
];

const risks = [
  'Risk register',
  'Risk records',
  'Risks',
];

const nonConformities = [
  'Non-conformities',
  'Exceptions',
];

const workInbox = [
  'Work inbox',
  'Work items',
  'Work',
];

const HomeTitlesSubcard = ({ loading }) => (
  <Subcard loading={loading}>
    <Subcard.Title>
      <Subcard.TitleItem pull="left">
        Home screen titles
      </Subcard.TitleItem>
    </Subcard.Title>

    <Subcard.Content>
      <Select label="Compliance standards" items={standard} />
      <Select label="Risk register" items={risks} />
      <Select label="Non-conformities" items={nonConformities} />
      <Select label="Work inbox" items={workInbox} />
    </Subcard.Content>

    <Subcard.Help>
      {OrganizationSettingsHelp.homeScreenTitles}
    </Subcard.Help>
  </Subcard>
);

HomeTitlesSubcard.propTypes = {
  loading: PropTypes.bool,
};

export default HomeTitlesSubcard;
