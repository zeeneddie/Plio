import { Mongo } from 'meteor/mongo';

import { CollectionNames } from '../constants';
import { ReviewSchema } from '../schemas/review-schema';


const Reviews = new Mongo.Collection(CollectionNames.REVIEWS);
Reviews.attachSchema(ReviewSchema);


export { Reviews };
