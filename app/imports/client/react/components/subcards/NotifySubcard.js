import PropTypes from 'prop-types';
import React from 'react';
import { CardTitle, FormGroup } from 'reactstrap';

import { Subcard, SubcardHeader, SubcardBody, Pull, CardBlock } from '../../components';
import OrgUsersSelectInputContainer from '../../containers/OrgUsersSelectInputContainer';

const NotifySubcard = ({ notify = [], ...props }) => (
  <Subcard>
    <SubcardHeader>
      <Pull left>
        <CardTitle>
          Notify Changes
        </CardTitle>
      </Pull>
      <Pull right>
        <CardTitle>
          {notify.length || ''}
        </CardTitle>
      </Pull>
    </SubcardHeader>
    <SubcardBody>
      <CardBlock>
        <FormGroup>
          <OrgUsersSelectInputContainer
            {...props}
            multi
            placeholder="User to notify"
            value={notify}
          />
        </FormGroup>
      </CardBlock>
    </SubcardBody>
  </Subcard>
);

NotifySubcard.propTypes = {
  notify: PropTypes.array,
};

export default NotifySubcard;
