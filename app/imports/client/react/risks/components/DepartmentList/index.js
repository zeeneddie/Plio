import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

import { CollectionNames } from '/imports/share/constants';
import createTypeItem from '../../../helpers/createTypeItem';
import LHSItemContainer from '../../../containers/LHSItemContainer';
import RisksListContainer from '../../containers/RisksListContainer';
import LabelMessagesCount from '../../../components/Labels/LabelMessagesCount';

const RiskDepartmentList = ({ departments, onToggleCollapse }) => (
  <div>
    {departments.map(department => (
      <LHSItemContainer
        hideRTextOnCollapse
        key={department._id}
        item={createTypeItem(CollectionNames.DEPARTMENTS, department._id)}
        lText={cx(department.name)}
        rText={department.unreadMessagesCount ? (
          <LabelMessagesCount count={department.unreadMessagesCount} />
        ) : null}
        count={department.risks.length}
        onToggleCollapse={onToggleCollapse}
      >
        <div className="sub">
          <RisksListContainer risks={department.risks} />
        </div>
      </LHSItemContainer>
    ))}
  </div>
);

RiskDepartmentList.propTypes = {
  departments: PropTypes.array.isRequired,
  onToggleCollapse: PropTypes.func.isRequired,
};

export default RiskDepartmentList;
