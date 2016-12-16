import React from 'react';
import cx from 'classnames';

import RHS from '../../../components/RHS';
import NotFound from './NotFound';
import NotExist from './NotExist';
import CustomersRHSHeaderButtonsContainer from '../../containers/RHSHeaderButtonsContainer';
import CustomersRHSContentList from './ContentList';


const CustomersRHS = (props) => { console.log(props); return (
  <RHS
    className={cx({
      content: !props.organization,
    })}
  >
    <RHS.Card className="standard-details">
      <RHS.Header
        title="Organization"
        isReady={props.isReady}
      >
        <CustomersRHSHeaderButtonsContainer
          organization={props.organization}
        />
      </RHS.Header>

      <CustomersRHSContentList
        isReady={props.isReady}
        organization={props.organization}
      />
    </RHS.Card>
  </RHS>
);};

CustomersRHS.NotFound = NotFound;
CustomersRHS.NotExist = NotExist;

export default CustomersRHS;
