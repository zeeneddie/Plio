import React, { PropTypes } from 'react';
import { _ } from 'meteor/underscore';
import { PullMap } from '/imports/api/constants';
import { OrganizationSettingsHelp } from '/imports/api/help-messages';
import Subcard from '../../components/Subcard';

const HomeTitlesSubcard = ({ children, pull, loading }) => (
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
  children: PropTypes.node,
  pull: PropTypes.oneOf(_.keys(PullMap)),
};

export default HomeTitlesSubcard;
