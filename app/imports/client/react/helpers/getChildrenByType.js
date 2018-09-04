import { _ } from 'meteor/underscore';

const getChildByType = (children, type) =>
  _.findWhere(children, { type }) || null;

export default getChildByType;
