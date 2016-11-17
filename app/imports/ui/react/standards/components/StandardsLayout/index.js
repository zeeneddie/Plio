import React from 'react';
import { StandardFilters } from '/imports/api/constants';
import Header from '../../../components/Header';
import Dropdown from '../../../components/Dropdown';
import { goToDashboard } from '../../../helpers/routeHelpers';
import { _ } from 'meteor/underscore';
import cx from 'classnames';
import { FlowRouter } from 'meteor/kadira:flow-router';

const getMenuItems = () => (
  _.map(StandardFilters, (filterParam, filter) => {
    const filterWithPrepend = cx(filterParam.prepend, filterParam.name);
    const urlFilter = FlowRouter.getQueryParam('filter');

    return (
      <Dropdown.Item
        pointer
        key={`standard-filter${filter}`}
        href={`?filter=${filter}`}
        value={filterWithPrepend}
        active={filter === urlFilter}
      >
        Standards - {filterWithPrepend}
      </Dropdown.Item>
    );
  })
);

const StandardsLayout = (props) => {
  console.log(props);
  return (
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
          {props.content}
        </div>
      </div>
    </div>
  );
};

export default StandardsLayout;
