import { Mongo } from 'meteor/mongo';

import { CollectionNames } from '../constants.js';
import { ProjectSchema } from '../schemas/project-schema.js';


const Projects = new Mongo.Collection(CollectionNames.PROJECTS);
Projects.attachSchema(ProjectSchema);

Projects.publicFields = {
  organizationId: 1,
  title: 1,
};

export { Projects };
