import PropTypes from 'prop-types';
import React from 'react';

import Field from './Field';
import Block from './Block';
import { Abbreviations } from '../../../../../share/constants';

const Lessons = ({ label, lessons = [] }) => (
  <Block>
    {label}
    <Field>
      {lessons
        .map(({ serialNumber, title }) => `${Abbreviations.LESSON}${serialNumber} ${title}`)
        .join(', ')}
    </Field>
  </Block>
);

Lessons.defaultProps = {
  label: 'Lessons learned',
};

Lessons.propTypes = {
  label: PropTypes.string,
  lessons: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Lessons;
