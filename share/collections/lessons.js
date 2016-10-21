import { Mongo } from 'meteor/mongo';

import { CollectionNames } from '../constants.js';
import { LessonsSchema } from '../schemas/lessons-schema.js';


const LessonsLearned = new Mongo.Collection(CollectionNames.LESSONS);
LessonsLearned.attachSchema(LessonsSchema);


export { LessonsLearned };
