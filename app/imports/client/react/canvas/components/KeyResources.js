import PropTypes from 'prop-types';
import React from 'react';

import CanvasSection from './CanvasSection';
import CanvasSectionHeading from './CanvasSectionHeading';
import CanvasAddButton from './CanvasAddButton';
import CanvasSectionHelp from './CanvasSectionHelp';
import KeyResourceAddModal from './KeyResourceAddModal';
import { WithToggle } from '../../helpers';

const KeyResources = ({ organizationId }) => (
  <WithToggle>
    {({ isOpen, toggle }) => (
      <CanvasSection empty onClick={toggle}>
        <CanvasSectionHeading>
          <h4>Key resources</h4>
          <KeyResourceAddModal {...{ isOpen, toggle, organizationId }} />
          <CanvasAddButton />
        </CanvasSectionHeading>
        <CanvasSectionHelp>
          <p>What key resources do our key activities require?</p>
        </CanvasSectionHelp>
      </CanvasSection>
    )}
  </WithToggle>
);

KeyResources.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default KeyResources;
