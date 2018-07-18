import PropTypes from 'prop-types';
import React from 'react';

import CanvasSection from './CanvasSection';
import CanvasSectionHeading from './CanvasSectionHeading';
import CanvasAddButton from './CanvasAddButton';
import CanvasSectionHelp from './CanvasSectionHelp';
import ChannelAddModal from './ChannelAddModal';
import { WithToggle } from '../../helpers';

const Channels = ({ organizationId }) => (
  <WithToggle>
    {({ isOpen, toggle }) => (
      <CanvasSection empty onClick={toggle}>
        <CanvasSectionHeading>
          <h4>Channels</h4>
          <ChannelAddModal {...{ isOpen, toggle, organizationId }} />
          <CanvasAddButton />
        </CanvasSectionHeading>
        <CanvasSectionHelp>
          <p>Through which channels do each of our segments want to be reached?</p>
          <p>Which ones are most cost-efficient?</p>
        </CanvasSectionHelp>
      </CanvasSection>
    )}
  </WithToggle>
);

Channels.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default Channels;
