import { Mongo } from 'meteor/mongo';

import { CollectionNames } from '../constants.js';
import { DepartmentSchema } from '../schemas/department-schema.js';


const Departments = new Mongo.Collection(CollectionNames.DEPARTMENTS);
Departments.attachSchema(DepartmentSchema);

export { Departments };
