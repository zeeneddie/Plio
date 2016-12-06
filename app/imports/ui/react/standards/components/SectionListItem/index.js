import React, { PropTypes } from 'react';

import LHSItemContainer from '../../../containers/LHSItemContainer';
import StandardListContainer from '../../containers/StandardListContainer';
import LabelMessagesCount from '../../../components/Labels/LabelMessagesCount';
import { createSectionItem } from '../../helpers';

const SectionListItem = ({
  _id, title, unreadMessagesCount, standards, onToggleCollapse, ...props,
}) => (
  <LHSItemContainer
    key={_id}
    item={createSectionItem(_id)}
    lText={title}
    rText={unreadMessagesCount && (
      <LabelMessagesCount count={unreadMessagesCount} />
    )}
    hideRTextOnCollapse
    onToggleCollapse={onToggleCollapse}
  >

    <StandardListContainer
      standards={standards}
      section={{ _id, title, unreadMessagesCount, standards, ...props }}
    />

  </LHSItemContainer>
);

SectionListItem.propTypes = {
  section: PropTypes.object.isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
};

export default SectionListItem;
