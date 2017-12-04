import React, { PropTypes } from 'react';

import Button from '../../../../components/Buttons/Button';
import Icon from '../../../../components/Icons/Icon';

const LinkItem = ({
  href, indicator, title, sequentialId, 
}) => (
  <Button
    href={href}
    color="secondary"
    className="btn-inline pointer"
  >
    {sequentialId && (<strong>{sequentialId} </strong>)}

    <span>{title}</span>

    {indicator && (
      <Icon
        name="circle"
        margin="left"
        className={`text-${indicator}`}
      />
    )}
  </Button>
);

LinkItem.propTypes = {
  href: PropTypes.string,
  indicator: PropTypes.string,
  title: PropTypes.string,
  sequentialId: PropTypes.string,
};

export default LinkItem;
