import React, { PropTypes } from 'react';
import { FormGroup, InputGroup, Input, InputGroupButton } from 'reactstrap';

import Button from '../../../components/Buttons/Button';
import Icon from '../../../components/Icon';

const MessagesForm = ({ onSubmit, disabled, children }) => (
  <div className="chat-form" {...{ onSubmit }}>
    <form className="f1">
      <fieldset {...{ disabled }}>
        <FormGroup>
          <InputGroup>
            {children}
            <Input
              name="message"
              placeholder="Add a comment"
              autoComplete="off"
            />
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
