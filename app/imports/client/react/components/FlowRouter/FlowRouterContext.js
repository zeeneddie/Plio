import { FlowRouter } from 'meteor/kadira:flow-router';

import { composeWithTracker } from '../../../util';

const onPropsChange = (props, onData) => {
  const { getParam, getQueryParam } = props;
  const data = { router: FlowRouter };

  if (getParam) Object.assign(data, { [getParam]: FlowRouter.getParam(getParam) });
  if (getQueryParam) {
    Object.assign(data, { [getQueryParam]: FlowRouter.getQueryParam(getQueryParam) });
  }

  return onData(null, data);
};

export default composeWithTracker(onPropsChange)(({ children, ...props }) => children(props));
