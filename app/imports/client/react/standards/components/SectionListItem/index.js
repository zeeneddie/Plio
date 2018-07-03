import PropTypes from 'prop-types';
import React from 'react';

import LHSItemContainer from '../../../containers/LHSItemContainer';
import StandardListContainer from '../../containers/StandardListContainer';
import LabelMessagesCount from '../../../components/Labels/LabelMessagesCount';
import { createSectionItem } from '../../helpers';

const SectionListItem = ({
  section, onToggleCollapse,
}) => (
  <LHSItemContainer
    key={section._id}
    item={createSectionItem(section._id)}
    lText={section.title}
    rText={!!section.unreadMessagesCount && (
      <LabelMessagesCount count={section.unreadMessagesCount} />
    )}
    hideRTextOnCollapse
    onToggleCollapse={onToggleCollapse}
  >

    <StandardListContainer
      standards={section.standards}
      section={section}
    />

  </LHSItemContainer>
);

SectionListItem.propTypes = {
  section: PropTypes.object.isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
};

export default SectionListItem;
