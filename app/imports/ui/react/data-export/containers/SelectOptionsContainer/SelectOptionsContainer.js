import React, { PropTypes } from 'react';
import { _ } from 'meteor/underscore';
import { compose, withProps } from 'recompose';

import SelectOptions from '../../components/SelectOptions';

import { riskMapping, Sections } from '/imports/api/data-export/mapping';

const enhance = compose(
  withProps(() => ({
    fields: Object.keys(riskMapping).map(key => ({
      name: key,
      ...riskMapping[key],
    })),
    sections: Sections,
    onSubmit(data) {
      const selectedFields = Object
        .keys(data)
        .filter(key => Boolean(data[key]));
    },
  }))
);

export default enhance(SelectOptions);
