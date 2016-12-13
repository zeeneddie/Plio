import React from 'react';
import { _ } from 'meteor/underscore';

import Field from '../fields/read/components/Field';
import { flattenObjects } from '/imports/api/helpers';
import { lowercase, capitalize } from '/imports/share/helpers';

const createKey = (label) => {
  const words = lowercase(label).split(' ');
  return [_.first(words)].concat(words.slice(1).map(word => capitalize(word))).join('');
};

const mapFields = fields => fields.map(({ label, text, wrap }) => {
  const field = <Field label={label}><span>{text}</span></Field>;
  return text ? ({
    [createKey(label)]: wrap ? (
      <div className={wrap}>
        {field}
      </div>
    ) : field,
  }) : null;
});

export default fields => flattenObjects(mapFields(fields));
