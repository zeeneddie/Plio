import Query from './Query';
import Mutation from './Mutation';
import Types from './Types';
import Scalars from './Scalars';
import Interface from './Interface';
import Subscription from './Subscription';
import Enum from './Enum';

export default [
  ...Query,
  ...Mutation,
  ...Types,
  ...Scalars,
  ...Interface,
  ...Subscription,
  ...Enum,
];
