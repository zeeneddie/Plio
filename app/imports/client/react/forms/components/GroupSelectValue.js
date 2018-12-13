import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Styles, GroupSelectAbbreviations } from '../../../../api/constants';

const Abbreviation = styled.span`
  font-size: 0.85rem;
  color: ${Styles.color.muted};
`;

const GroupSelectValue = ({ label, type }) => (
  <Fragment>
    {label}
    {type && (
      <Fragment>
        {' '}
        <Abbreviation>{GroupSelectAbbreviations[type]}</Abbreviation>
      </Fragment>
    )}
  </Fragment>
);

GroupSelectValue.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
};

export default GroupSelectValue;
