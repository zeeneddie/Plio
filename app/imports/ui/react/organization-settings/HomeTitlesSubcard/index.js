import React, { PropTypes } from 'react';
import { OrganizationSettingsHelp } from '/imports/api/help-messages';
import Subcard from '../../components/Subcard';

const HomeTitlesSubcard = ({ loading }) => (
  <Subcard loading={loading}>
    <Subcard.Title>
      <Subcard.TitleItem pull="left">
        Home screen titles
      </Subcard.TitleItem>
    </Subcard.Title>

    <Subcard.Content>
      World
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
