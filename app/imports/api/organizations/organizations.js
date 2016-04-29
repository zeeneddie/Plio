import { Mongo } from 'meteor/mongo';

import { OrganizationSchema } from './organization-schema.js';


const Organizations = new Mongo.Collection('Organizations');
Organizations.attachSchema(OrganizationSchema);

export { Organizations };
