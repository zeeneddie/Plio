import { Mongo } from 'meteor/mongo';

import { LessonsSchema } from './lessons-schema.js';

const Lessons = new Mongo.Collection('Lessons');
Lessons.attachSchema(LessonsSchema);

export { Lessons };
