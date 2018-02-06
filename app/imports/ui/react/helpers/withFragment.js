import { lifecycle, withStateHandlers, mapProps } from 'recompose';
import { mergeDeepRight, identity } from 'ramda';

import namedCompose from './namedCompose';
import { client } from '../../../client/apollo';

export default (fragment, {
  name = 'data',
  getFragmentId,
  props: mapOptionsToProps = identity,
}) => namedCompose('withFragment')(
  withStateHandlers(props => ({
    [name]: client.readFragment({
      fragment,
      id: getFragmentId(props),
    }),
  }), {
    setData: ({ [name]: data }) => payload => ({
      [name]: mergeDeepRight(data, Object.assign({}, payload)),
    }),
  }),
  lifecycle({
    componentWillReceiveProps(props) {
      if (getFragmentId(this.props) !== getFragmentId(props)) {
        const data = client.readFragment({
          fragment,
          id: getFragmentId(props),
        });

        this.props.setData(data);
      }
    },
  }),
  mapProps(({ data, ...props }) => mapOptionsToProps({ data, ...props })),
);
