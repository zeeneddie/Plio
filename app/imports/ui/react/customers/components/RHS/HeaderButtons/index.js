import React, { PropTypes } from 'react';

import Button from '../../../../components/Buttons/Button';

const HeaderButtons = (props) => (
  <div>
    <Button type="primary" onClick={props.onModalOpen} >
      Edit
    </Button>
  </div>
);

HeaderButtons.propTypes = {
  onModalOpen: PropTypes.func,
};

export default HeaderButtons;
