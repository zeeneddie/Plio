import React from 'react';

import { CustomerTypesNames } from '/imports/share/constants';
import { createTypeItem } from '../../helpers';
import LHSItemContainer from '../../../containers/LHSItemContainer';
import CustomersListContainer from '../../containers/ListContainer';
import propTypes from './propTypes';

const CustomersTypeList = ({ types, onToggleCollapse }) => (
  <div>
    {types.map(type => (
      <LHSItemContainer
        key={type.customerType}
        item={createTypeItem(type.customerType)}
        lText={CustomerTypesNames[type.customerType]}
        rText={type.organizations.length}
        onToggleCollapse={onToggleCollapse}
      >
        <div className="sub">
          <CustomersListContainer organizations={type.organizations} />
        </div>
      </LHSItemContainer>
    ))}
  </div>
);

CustomersTypeList.propTypes = propTypes;

export default CustomersTypeList;
