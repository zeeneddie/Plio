import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

import { searchByRegex, createSearchRegex, propEq } from '/imports/api/helpers';
import MentionView from './view';

export default class Mention extends React.Component {
  static get defaultProps() {
    const users = Meteor.users.find().map((user) => ({
      text: user.fullNameOrEmail(),
      value: user._id,
      email: user.emails[0].address,
    }));

    return {
      users,
      by: '@',
    };
  }

  static get propTypes() {
    return {
      by: PropTypes.string,
      users: PropTypes.arrayOf(PropTypes.shape({
        text: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        email: PropTypes.string.isRequired,
      })),
    };
  }

  constructor(props) {
    super(props);

    this.state = { isOpen: false, value: '', users: [], match: [] };

    this.toggle = this.toggle.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleUserClick = this.handleUserClick.bind(this);
  }

  handleInputChange(e) {
    const value = e.target.value;
    const pattern = new RegExp(`\\B${this.props.by}[a-z0-9_-]+`, 'gi');
    const match = value.match(pattern) || [];
    const lastMatch = `${_.last(match)}`;
    const searchRegex = createSearchRegex(lastMatch.replace(/@/gi, ''));
    const users = searchByRegex(searchRegex, ['text', 'email'], [...this.props.users]);

    if (match.length) {
      this.setState({ isOpen: true });
    } else {
      this.setState({ isOpen: false });
    }

    this.setState({ users, match, value: e.target.value });
  }

  handleUserClick(e, selectedUser) {
    const user = this.state.users.find(propEq('value', selectedUser.value));

    if (!user) {
      return this.setState({ isOpen: false });
    }

    const lastMatch = `${_.last(this.state.match)}`;
    const userDisplayName = `${this.props.by}${user.value} (${user.text})`;
    const value = this.state.value.replace(lastMatch, userDisplayName);
    const match = this.state.match.slice(0, this.state.match.length - 1).concat(selectedUser.email);

    return this.setState({ value, match, isOpen: false }, () => {
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
    return (
      <MentionView
        {...{ ...this.props, ...this.state }}
        getInputRef={node => (this.input = node)}
        toggle={this.toggle}
        onChange={this.handleInputChange}
        onUserClick={this.handleUserClick}
      />
    );
  }
}
