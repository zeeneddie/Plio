import React from 'react';
import { StandardFilters } from '/imports/api/constants';
import Header from '../../../components/Header';
import Dropdown from '../../../components/Dropdown';
import goToDashboard from '../../../helpers/goToDashboard';

const getMenuItems = () => (
  _.map(StandardFilters, (filterName, filter) =>
    <Dropdown.Item
      pointer
      key={`standard-filter${filter}`}
      href={`?filter=${filter}`}
      value={filterName}
    >
      Standard - by {filterName}
    </Dropdown.Item>
  )
);

const StandardsLayout = (props) => (
  <div>
    <Header>
      <Dropdown className="navbar-title">
        <Dropdown.Title>
          Standard <span className="text-muted">- by @value</span>
        </Dropdown.Title>
        <Dropdown.Menu>
          {getMenuItems()}
        </Dropdown.Menu>
      </Dropdown>
      <Header.ArrowBack pull="left" onClick={goToDashboard} />
    </Header>
    <div className="content">
      <div className="container-fluid">
        {props.content}
      </div>
    </div>
  </div>
);

export default StandardsLayout;
