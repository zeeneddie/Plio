import PropTypes from 'prop-types';
import { defaultProps, componentFromProp, setPropTypes, withHandlers } from 'recompose';
import { mapRejectedEntitiesToOptions } from 'plio-util';

import { namedCompose } from '../../helpers';
import { SelectInput } from '../../components';
import { client } from '../../../apollo';
import { Query } from '../../../graphql';

export default namedCompose('RiskSelectInputContainer')(
  setPropTypes({
    organizationId: PropTypes.string.isRequired,
    without: PropTypes.arrayOf(PropTypes.string),
  }),
  defaultProps({
    component: SelectInput,
    without: [],
    loadOptionsOnOpen: true,
  }),
  withHandlers({
    loadOptions: ({ organizationId, risks }) => () => client.query({
      query: Query.RISK_LIST,
      variables: { organizationId },
    }).then(({
      data: {
        risks: {
          risks: resultRisks,
        },
      },
    }) => ({
      options: mapRejectedEntitiesToOptions(risks, resultRisks),
    })),
  }),
)(componentFromProp('component'));
