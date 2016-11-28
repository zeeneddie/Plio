import React from 'react';

// import propTypes from './propTypes';
import LHSContainer from '../../../containers/LHSContainer';
import HelpsLHSSectionList from '../HelpsLHSSectionList';


const HelpsLHS = (props) => (
  <LHSContainer
    animating={props.animating}
    searchText={props.searchText}
  >
    <HelpsLHSSectionList
      sections={props.sections}
      orgSerialNumber={props.orgSerialNumber}
      userId={props.userId}
      urlItemId={props.urlItemId}
    />
  </LHSContainer>
);

export default HelpsLHS;
