import { Mongo } from 'meteor/mongo';

import { CollectionNames } from '../../constants';
import { ChangelogSchema } from '../../schemas/server/changelog-schema';


const Changelog = new Mongo.Collection(CollectionNames.CHANGELOG);
Changelog.attachSchema(ChangelogSchema);

export { Changelog };
