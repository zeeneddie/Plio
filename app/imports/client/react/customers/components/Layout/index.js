import React from 'react';

import propTypes from './propTypes';
import Header from '../../../components/Header';
import CustomersPage from '../Page';
import PreloaderPage from '../../../components/PreloaderPage';

const CustomersLayout = props => (
  <div>
    <Header>
      <Header.Title>
        Organizations by type
      </Header.Title>
      <Header.ArrowBack pull="left" onClick={props.onHandleReturn} />
    </Header>
    <div className="content">
      <div className="container-fluid">
        {props.loading ? (
          <PreloaderPage />
        ) : (
          <CustomersPage {...props} />
        )}
      </div>
    </div>
  </div>
);

CustomersLayout.propTypes = propTypes;

export default CustomersLayout;
