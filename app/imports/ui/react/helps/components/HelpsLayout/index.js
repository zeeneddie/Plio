import React from 'react';

import propTypes from './propTypes';
import Header from '../../../components/Header';
import PreloaderPage from '../../../components/PreloaderPage';

const HelpsLayout = (props) => (
  <div>
    <Header>
      <Header.Title>
        Help center
      </Header.Title>
      <Header.ArrowBack pull="left" onClick={props.onHandleReturn} />
    </Header>
    <div className="content">
      <div className="container-fluid">
        {props.isLoading ? (
          <PreloaderPage />
        ) : (
          <div></div>
        )}
      </div>
    </div>
  </div>
);

HelpsLayout.propTypes = propTypes;

export default HelpsLayout;
