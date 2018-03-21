import PropTypes from 'prop-types';
import { defaultProps, componentFromProp, setPropTypes, withHandlers } from 'recompose';
import { mapEntitiesToOptions, rejectBy } from 'plio-util';
import { compose } from 'ramda';

import { namedCompose } from '../../helpers';
import { SelectInput } from '../../components';
import { client } from '../../../../client/apollo';
import { Query } from '../../../../client/graphql';

export default namedCompose('RiskSelectInputContainer')(
  setPropTypes({
    organizationId: PropTypes.string.isRequired,
    without: PropTypes.arrayOf(PropTypes.string),
  }),
  defaultProps({
    component: SelectInput,
    without: [],
    loadOptionsOnFocus: true,
  }),
  withHandlers({
    loadOptions: ({ organizationId, without }) => () => client.query({
      query: Query.RISK_LIST,
      variables: { organizationId },
    }).then(({
      data: {
        risks: {
          risks,
        },
      },
    }) => ({
      options: compose(mapEntitiesToOptions, rejectBy('_id', without))(risks),
    })),
  }),
)(componentFromProp('component'));
