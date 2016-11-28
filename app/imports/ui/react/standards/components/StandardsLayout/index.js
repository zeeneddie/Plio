import React from 'react';
import cx from 'classnames';
import { _ } from 'meteor/underscore';

import propTypes from './propTypes';
import Header from '../../../components/Header';
import Dropdown from '../../../components/Dropdown';
import StandardsPage from '../StandardsPage';
import PreloaderPage from '../../../components/PreloaderPage';

const getMenuItems = ({ filters, filter }) => (
  _.map(filters, ({ prepend, name }, key) => {
    const filterWithPrepend = cx(prepend, name);

    return (
      <Dropdown.Item
        pointer
        key={`standard-filter${key}`}
        href={`?filter=${key}`}
        value={filterWithPrepend}
        active={parseInt(key, 10) === parseInt(filter, 10)}
      >
        Standards - {filterWithPrepend}
      </Dropdown.Item>
    );
  })
);

const StandardsLayout = (props) => (
  <div>
    <Header>
      {props.isDiscussionOpened ? (
        <span className="navbar-title">
          {cx(
            props.standard ? `${props.standard.title} - ` : '',
            'discussion'
          )}
        </span>
      ) : (
        <Dropdown
          className="navbar-title"
          activeItemIndex={props.filter - 1}
          onChange={props.onHandleFilterChange}
        >
          <Dropdown.Title>
            Standards <span className="text-muted">- @value</span>
          </Dropdown.Title>
          <Dropdown.Menu>
            {getMenuItems(props)}
          </Dropdown.Menu>
        </Dropdown>
      )}
      <Header.ArrowBack pull="left" onClick={props.onHandleReturn} />
    </Header>
    <div className="content">
      <div className="container-fluid">
        {props.loading ? (
          <PreloaderPage />
        ) : (
          <StandardsPage {...props} />
        )}
      </div>
    </div>
  </div>
);

StandardsLayout.propTypes = propTypes;

export default StandardsLayout;
