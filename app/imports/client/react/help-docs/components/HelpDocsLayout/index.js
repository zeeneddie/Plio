import React from 'react';

import Header from '../../../components/Header';
import PreloaderPage from '../../../components/PreloaderPage';
import HelpDocsPage from '../HelpDocsPage';
import propTypes from './propTypes';

const HelpDocsLayout = props => (
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
          <HelpDocsPage />
        )}
      </div>
    </div>
  </div>
);

HelpDocsLayout.propTypes = propTypes;

export default HelpDocsLayout;
