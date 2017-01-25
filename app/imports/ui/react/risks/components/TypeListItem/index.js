import React, { PropTypes } from 'react';
import cx from 'classnames';

import { CollectionNames } from '/imports/share/constants';
import { createRiskTypeItem } from '../../helpers';
import LHSItemContainer from '../../../containers/LHSItemContainer';
import RisksListContainer from '../../containers/RisksListContainer';
import LabelMessagesCount from '../../../components/Labels/LabelMessagesCount';

const TypeListItem = ({
  onToggleCollapse,
  type: { _id, abbreviation, unreadMessagesCount, title, risks },
}) => (
  <LHSItemContainer
    hideRTextOnCollapse
    {...{ onToggleCollapse }}
    item={createRiskTypeItem(_id)}
    // TODO: move to separated helper
    lText={cx(title, abbreviation && `(${abbreviation})`)}
    rText={!!unreadMessagesCount && (
      <LabelMessagesCount count={unreadMessagesCount} />
    )}
  >
    <div className="sub">
      <RisksListContainer {...{ risks }} />
    </div>
  </LHSItemContainer>
);

TypeListItem.propTypes = {
  onToggleCollapse: PropTypes.func,
  type: PropTypes.object,
};

export default TypeListItem;
