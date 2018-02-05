import { lifecycle, withStateHandlers, mapProps } from 'recompose';
import { mergeDeepRight, identity } from 'ramda';

import namedCompose from './namedCompose';
import { client } from '../../../client/apollo';

export default (fragment, {
  name = 'data',
  getFragmentId,
  props: mapOptionsToProps = identity,
}) => namedCompose('withFragment')(
  withStateHandlers({
    [name]: {},
  }, {
    setData: ({ [name]: data }) => payload => ({
      [name]: mergeDeepRight(data, Object.assign({}, payload)),
    }),
  }),
  lifecycle({
    async readFragmentFromCache({
      setData,
      ...props
    }) {
      const data = await client.readFragment({
        fragment,
        id: getFragmentId(props),
      });

      setData(data);
    },
    componentDidMount() {
      this.readFragmentFromCache(this.props);
    },
    componentWillReceiveProps(props) {
      if (getFragmentId(this.props) !== getFragmentId(props)) {
        this.readFragmentFromCache(props);
      }
    },
  }),
  mapProps(({ data, ...props }) => mapOptionsToProps({ data, ...props })),
);
