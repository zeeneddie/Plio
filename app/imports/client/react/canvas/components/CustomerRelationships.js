import PropTypes from 'prop-types';
import React from 'react';

import CanvasSection from './CanvasSection';
import CanvasSectionHeading from './CanvasSectionHeading';
import CanvasAddButton from './CanvasAddButton';
import CanvasSectionHelp from './CanvasSectionHelp';
import CustomerRelationshipAddModal from './CustomerRelationshipAddModal';
import { WithToggle } from '../../helpers';

const CustomerRelationships = ({ organizationId }) => (
  <WithToggle>
    {({ isOpen, toggle }) => (
      <CanvasSection empty onClick={toggle}>
        <CanvasSectionHeading>
          <h4>Customer relationships</h4>
          <CustomerRelationshipAddModal {...{ isOpen, toggle, organizationId }} />
          <CanvasAddButton />
        </CanvasSectionHeading>
        <CanvasSectionHelp>
          <p>What type of relationship do you want with customers?</p>
          <p>Which fits best with each segment?</p>
        </CanvasSectionHelp>
      </CanvasSection>
    )}
  </WithToggle>
);

CustomerRelationships.propTypes = {
  organizationId: PropTypes.string.isRequired,
};

export default CustomerRelationships;
