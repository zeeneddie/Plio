import { Mongo } from 'meteor/mongo';

import { CanvasSettingsSchema } from '../schemas';
import { CollectionNames } from '../constants';

const CanvasSettings = new Mongo.Collection(CollectionNames.CANVAS_SETTINGS);

CanvasSettings.attachSchema(CanvasSettingsSchema);

export { CanvasSettings };
