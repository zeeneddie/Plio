import { FlowRouter } from 'meteor/kadira:flow-router';

export const isSelected = _id => Object.is(_id, FlowRouter.getQueryParam('at'));

export const getClassName = (props) => {
  const first = props.isMergedWithPreviousMessage ? 'first' : '';
  const selected = isSelected(props._id) ? 'selected' : '';

  return `${first} ${selected}`;
};
