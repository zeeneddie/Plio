import React from 'react';
import cx from 'classnames';
import { _ } from 'meteor/underscore';

import { StandardFilters } from '/imports/api/constants';
import { goToDashboard } from '../../../helpers/routeHelpers';
import Header from '../../../components/Header';
import Dropdown from '../../../components/Dropdown';
import StandardsPage from '../StandardsPage';
import PreloaderPage from '../../../components/PreloaderPage';

const getMenuItems = () => (
  _.map(StandardFilters, (filterParam, filter) => {
    const filterWithPrepend = cx(filterParam.prepend, filterParam.name);

    return (
      <Dropdown.Item
        pointer
        key={`standard-filter${filter}`}
        href={`?filter=${filter}`}
        value={filterWithPrepend}
      >
        Standards - {filterWithPrepend}
      </Dropdown.Item>
    );
  })
);

const StandardsLayout = (props) => (
  <div>
    <Header>
      <Dropdown className="navbar-title">
        <Dropdown.Title>
          Standards <span className="text-muted">- @value</span>
        </Dropdown.Title>
        <Dropdown.Menu>
          {getMenuItems()}
        </Dropdown.Menu>
      </Dropdown>
      <Header.ArrowBack pull="left" onClick={goToDashboard} />
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

export default StandardsLayout;
