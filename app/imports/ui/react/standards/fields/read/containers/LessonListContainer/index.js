import { connect } from 'react-redux';
import { compose, mapProps, setPropTypes } from 'recompose';
import { PropTypes } from 'react';

import { DocumentTypes } from '/imports/share/constants';
import { pickDeep, propEq, every } from '/imports/api/helpers';

export default compose(
  setPropTypes({
    standardId: PropTypes.string.isRequired,
  }),
  connect(() => pickDeep('collections.lessons')),
  mapProps(({ lessons, ...props }) => ({
    ...props,
    lessons: lessons.filter(every([
      propEq('documentId', props.standardId),
      propEq('documentType', DocumentTypes.STANDARD),
    ])).map(ll => ({
      ...ll,
      sequentialId: `LL${ll.serialNumber}`,
    })),
  })),
);
