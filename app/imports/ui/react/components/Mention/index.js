import PropTypes from 'prop-types';
import React from 'react';
import { _ } from 'meteor/underscore';
import { Dropdown } from 'reactstrap';

import { searchByRegex, createSearchRegex, propEq, omitC } from '/imports/api/helpers';
import Input from './Input';
import Menu from './Menu';
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
    const prevValue = this.props.value;

    this.props.setValue(value);

    this.handleInputChange(value, prevValue);
  }

  handleInputChange(value, prevValue) {
    const match = value.match(MENTION_REGEX) || [];
    const lastMatch = `${_.last(match)}`;
    const searchRegex = createSearchRegex(lastMatch.replace(/@/gi, ''));
    const users = searchByRegex(searchRegex, ['text', 'email'], [...this.props.users]);

    if (match.length) {
      this.setState({ isOpen: true });
    } else {
      this.setState({ isOpen: false });
    }

    const callback = () => (users.length === 0 || value !== prevValue) && this.input.focus();

    this.setState({ users, match }, callback);
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

    const callback = () => {
      if (this.input) {
        this.input.focus();
        this.input.scrollLeft = this.input.scrollWidth;
      }
    };

    return this.setState({ match, isOpen: false }, callback);
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
            innerRef: input => (this.input = input),
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

    const ddprops = omitC(Object.keys(propTypes), this.props);

    return (
      <Dropdown
        dropup={this.props.dropup}
        isOpen={this.state.isOpen}
        toggle={this.toggle}
        className={this.props.className}
        {...{ ...ddprops }}
      >
        {children}
      </Dropdown>
    );
  }
}

Mention.propTypes = propTypes;

Mention.Input = Input;
Mention.Menu = Menu;

export default Mention;
