import React, { PropTypes } from 'react';

import Field from '../Field';
import Block from '../Block';
import _user_ from '/imports/startup/client/mixins/user';

const NotifyRead = ({ users }) => (
  <Block label="Notify changes">
    <Field>
      {users.map(_user_.userNameOrEmail).join(', ')}
    </Field>
  </Block>
);

NotifyRead.propTypes = {
  users: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])).isRequired,
};

export default NotifyRead;
