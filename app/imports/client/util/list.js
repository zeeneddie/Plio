import { compose, join, pluck } from 'ramda';

// ([...{ _id: String }]: Array) => String
export const joinIds = compose(join(' '), pluck('_id'));
