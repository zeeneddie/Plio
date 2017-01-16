import React, { PropTypes } from 'react';
import { _ } from 'meteor/underscore';
import cx from 'classnames';
import { Dropdown } from 'reactstrap';

import { searchByRegex, createSearchRegex, propEq, omitC } from '/imports/api/helpers';
import Input from './Input';
import Menu from './Menu';
import MenuItem from './MenuItem';
import { MENTION_REGEX } from '/imports/share/mentions';

const propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  dropup: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
  users: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    email: PropTypes.string.isRequired,
  })).isRequired,
};

class Mention extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false, users: [], match: [] };

    this.toggle = this.toggle.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.handleInputChange = _.debounce(this.handleInputChange, 300).bind(this);
    this.handleUserSelect = this.handleUserSelect.bind(this);
  }

  onInputChange(e) {
    const value = e.target.value;

    this.props.setValue(value);

    this.handleInputChange(value);
  }

  handleInputChange(value) {
    const match = value.match(MENTION_REGEX) || [];
    const lastMatch = `${_.last(match)}`;
    const searchRegex = createSearchRegex(lastMatch.replace(/@/gi, ''));
    const users = searchByRegex(searchRegex, ['text', 'email'], [...this.props.users]);

    if (match.length) {
      this.setState({ isOpen: true });
    } else {
      this.setState({ isOpen: false });
    }

    this.setState({ users, match });
  }

  handleUserSelect(e, selectedUser) {
    const user = this.state.users.find(propEq('value', selectedUser.value));

    if (!user) {
      return this.setState({ isOpen: false });
    }

    const lastMatch = `${_.last(this.state.match)}`;
    const userDisplayName = `@${user.text.split(' ')[0]} (${user.email}) `;
    const value = this.props.value.replace(lastMatch, userDisplayName);
    const match = this.state.match.slice(0, this.state.match.length - 1).concat(selectedUser.email);

    this.props.setValue(value);

    return this.setState({ match, isOpen: false }, () => {
      if (this.input) {
        this.input.focus();
        this.input.scrollLeft = this.input.scrollWidth;
      }
    });
  }

  toggle() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    const children = React.Children.map(this.props.children, (child) => {
      switch (child.type) {
        case Input:
          return React.cloneElement(child, {
            onChange: this.onInputChange,
            value: this.props.value,
            getRef: (input) => (this.input = input),
          });
        case Menu:
          return this.state.users.length ? React.cloneElement(child, {
            onUserSelect: this.handleUserSelect,
            users: this.state.users,
          }) : null;
        default:
          return child;
      }
    });

    const className = cx(this.props.dropup && 'dropup', this.props.className);
    const ddprops = omitC(Object.keys(propTypes), this.props);

    return (
      <Dropdown {...{ ...ddprops, className }} isOpen={this.state.isOpen} toggle={this.toggle}>
        {children}
      </Dropdown>
    );
  }
}

Mention.propTypes = propTypes;

Mention.Input = Input;
Mention.Menu = Menu;
Mention.MenuItem = MenuItem;

export default Mention;
