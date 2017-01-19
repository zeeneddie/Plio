import { compose, setPropTypes, mapProps } from 'recompose';
import { connect } from 'react-redux';
import { PropTypes } from 'react';
import property from 'lodash.property';

import {
  every,
  notDeleted,
  includes,
  propEqId,
  pickC,
  propEq,
} from '/imports/api/helpers';
import { ProblemTypes, DocumentTypes } from '/imports/share/constants';
import ConnectedDocList from '../../components/ConnectedDocList';

export default compose(
  setPropTypes({
    riskId: PropTypes.string.isRequired,
  }),
  connect(() => (state) => ({
    ...pickC(['userId'], state.global),
    ...pickC([
      'ncs', 'risks', 'actions', 'lessons', 'workItems',
    ], state.collections),
  })),
  mapProps((props) => {
    const problemFilter = every([
      notDeleted,
      compose(includes(props.riskId), property('risksIds')),
    ]);
    const ncs = props.ncs.filter(problemFilter);
    const risks = props.risks.filter(problemFilter);
    const actions = props.actions.filter(every([
      notDeleted,
      ({ linkedTo }) => linkedTo.find(({ documentId, documentType }) => !!(
        (documentType !== ProblemTypes.NON_CONFORMITY ||
        documentType !== ProblemTypes.RISK) &&
        ncs.concat(risks).find(propEqId(documentId))
      )),
    ]));
    const lessons = props.lessons.filter(every([
      propEq('documentId', props.riskId),
      propEq('documentType', DocumentTypes.STANDARD),
    ])).map(ll => ({
      ...ll,
      sequentialId: `LL${ll.serialNumber}`,
    }));

    return { ...props, ncs, risks, actions, lessons };
  })
)(ConnectedDocList);
