import React from 'react';

import renderComponent from '../../helpers/renderComponent';
import { Consumer } from './EntityModal';

const EntityModalGuidance = props => (
  <Consumer>
    {({ state: { isGuidanceOpen: isOpen }, toggleGuidance: toggle }) => renderComponent({
      ...props,
      isOpen,
      toggle,
    })}
  </Consumer>
);

export default EntityModalGuidance;
