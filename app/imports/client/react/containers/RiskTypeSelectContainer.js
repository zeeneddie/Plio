import PropTypes from 'prop-types';
import { withHandlers, setPropTypes, defaultProps, componentFromProp } from 'recompose';

import { namedCompose, omitProps } from '../helpers';
import { Select } from '../components';
import { Query } from '../../graphql';
import { client } from '../../apollo';

export default namedCompose('RiskTypeSelectContainer')(
  setPropTypes({ organizationId: PropTypes.string.isRequired }),
  defaultProps({ component: Select }),
  withHandlers({
    loadOptions: ({ organizationId }) => () => client.query({
      query: Query.RISK_TYPE_LIST,
      variables: { organizationId },
    }).then(({
      data: {
        riskTypes: {
          riskTypes,
        },
      },
    }) => ({
      options: riskTypes.map(({ _id, title }) => ({
        text: title,
        value: _id,
      })),
    })),
  }),
  omitProps(['organizationId']),
)(componentFromProp('component'));

