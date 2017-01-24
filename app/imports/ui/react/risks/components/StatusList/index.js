import React, { PropTypes } from 'react';

import createTypeItem from '../../../helpers/createTypeItem';
import LHSItemContainer from '../../../containers/LHSItemContainer';
import RisksListContainer from '../../containers/RisksListContainer';


const StatusList = ({ statuses, onToggleCollapse }) => (
  <div>
    {statuses.map(status => (
      <LHSItemContainer
        key={status.number}
        item={createTypeItem('RISK.STATUSES', status.number)}
        lText={status.title}
        hideRTextOnCollapse
        onToggleCollapse={onToggleCollapse}
      >
        <div className="sub">
          <RisksListContainer risks={status.risks} />
        </div>
      </LHSItemContainer>
    ))}
  </div>
);

StatusList.propTypes = {
  statuses: PropTypes.array.isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
};

export default StatusList;
