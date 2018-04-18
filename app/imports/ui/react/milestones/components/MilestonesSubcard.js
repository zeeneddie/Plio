import React from 'react';
import PropTypes from 'prop-types';

import { EntityManagerSubcard } from '../../components';

export const MilestonesSubcard = ({
  milestones,
  ...props
}) => (
  <EntityManagerSubcard
    title="Milestones"
    newEntityTitle="New milestone"
    newEntityButtonTitle="Add a new milestone"
    entities={milestones}
    {...props}
  />
);

MilestonesSubcard.propTypes = {
  milestones: PropTypes.arrayOf(PropTypes.object),
  onSave: PropTypes.func,
};

export default MilestonesSubcard;
