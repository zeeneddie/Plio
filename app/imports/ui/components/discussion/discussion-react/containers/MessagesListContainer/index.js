import React from 'react';
import { connect } from 'react-redux';

import MessagesList from '../../components/MessagesList';
import { pickFromDiscussion } from '/imports/api/helpers.js';

export default connect(pickFromDiscussion(['at']))(MessagesList);
