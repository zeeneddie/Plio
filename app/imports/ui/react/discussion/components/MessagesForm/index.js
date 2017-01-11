import React, { PropTypes } from 'react';
import { FormGroup, InputGroup, InputGroupButton } from 'reactstrap';
import { compose, withState, withProps } from 'recompose';
import { Meteor } from 'meteor/meteor';

import { omitProps } from '/imports/api/helpers';
import Button from '../../../components/Buttons/Button';
import Icon from '../../../components/Icons/Icon';
import Mention from '../../../components/Mention';

const EnhancedMention = compose(
  withState('value', 'setValue', ''),
  omitProps(['setCollapsed']),
  withProps(() => ({
    users: Meteor.users.find().map((user) => ({
      text: user.fullNameOrEmail(),
      value: user._id,
      email: user.emails[0].address,
    })),
  }))
)(Mention);

const MessagesForm = ({ onSubmit, disabled, children }) => (
  <div className="chat-form" {...{ onSubmit }}>
    <form className="f1">
      <fieldset {...{ disabled }}>
        <FormGroup>
          <InputGroup>
            {children}

            <EnhancedMention dropup>
              <Mention.Input placeholder="Add a comment" name="message" autoComplete="off" />
              <Mention.Menu />
            </EnhancedMention>

            <InputGroupButton>
              <Button type="submit" color="secondary" component="button">
                <Icon name="angle-right" />
              </Button>
            </InputGroupButton>
          </InputGroup>
        </FormGroup>
      </fieldset>
    </form>
  </div>
);

MessagesForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  children: PropTypes.node,
};

export default MessagesForm;
