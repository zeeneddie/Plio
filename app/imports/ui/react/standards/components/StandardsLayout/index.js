import React from 'react';
import cx from 'classnames';
import { _ } from 'meteor/underscore';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { StandardFilters } from '/imports/api/constants';
import { goToDashboard } from '../../../helpers/routeHelpers';
import Header from '../../../components/Header';
import Dropdown from '../../../components/Dropdown';

const getMenuItems = ({ filter }) => (
  _.map(StandardFilters, ({ prepend, name }, key) => {
    const filterWithPrepend = cx(prepend, name);
    const urlFilter = filter || FlowRouter.getQueryParam('filter');

    return (
      <Dropdown.Item
        pointer
        key={`standard-filter${key}`}
        href={`?filter=${key}`}
        value={filterWithPrepend}
        active={parseInt(key, 10) === parseInt(urlFilter, 10)}
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
          {getMenuItems(props)}
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
