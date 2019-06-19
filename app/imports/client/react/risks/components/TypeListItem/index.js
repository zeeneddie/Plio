import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import { createRiskTypeItem } from '../../helpers';
import LHSItemContainer from '../../../containers/LHSItemContainer';
import RisksListContainer from '../../containers/RisksListContainer';
import LabelMessagesCount from '../../../components/Labels/LabelMessagesCount';

const TypeListItem = ({
  onToggleCollapse,
  type: {
    _id,
    abbreviation,
    unreadMessagesCount,
    title,
    risks,
  },
}) => (
  <LHSItemContainer
    hideRTextOnCollapse
    {...{ onToggleCollapse }}
    item={createRiskTypeItem(_id)}
    lText={cx(title, abbreviation && `(${abbreviation})`)}
    rText={unreadMessagesCount ? (
      <LabelMessagesCount count={unreadMessagesCount} />
    ) : null}
    count={risks.length}
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
