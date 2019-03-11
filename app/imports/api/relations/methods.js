import { Relations } from '../../share/collections/relations';
import { IdsRelationSchema } from '../../share/schemas/schemas';
import RelationService from '../../share/services/relation-service';
import RelationSchema from '../../share/schemas/relation-schema';
import Method from '../method';

export const insert = new Method({
  name: 'Relations.insert',

  validate: RelationSchema.validator(),

  run(args) {
    return RelationService.insert(args, { userId: this.userId, collections: { Relations } });
  },
});

export const remove = new Method({
  name: 'Relations.remove',

  validate: IdsRelationSchema.validator(),

  run(args) {
    return RelationService.delete(args, { collections: { Relations } });
  },
});
