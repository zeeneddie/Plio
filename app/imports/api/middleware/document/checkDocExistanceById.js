import { checkDocExistance } from '../../checkers';

export default collection => (next, args, context) => {
  checkDocExistance(collection, { _id: args._id });
  return next(args, context);
};
