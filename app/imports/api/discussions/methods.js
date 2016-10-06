import { CheckedMethod } from '../method';
import { ViewedBySchema } from './discussions-schema';
import DiscussionsService from './discussions-service';
import { idSchemaDoc } from '../schemas';
import { inject } from '../helpers';
import { Discussions } from './discussions';
import { DSC_OnUpdateViewedByChecker } from '../checkers';

const injectDSC = inject(Discussions);

export const updateViewedBy = new CheckedMethod({
  name: 'Discussions.viewedBy.update',

  validate: new SimpleSchema({
    _id: idSchemaDoc,
    messageId: idSchemaDoc
  }).validator(),

  check: checker => injectDSC(checker)(DSC_OnUpdateViewedByChecker),

  run({ _id, messageId }) {
    return DiscussionsService.updateViewedBy({
      _id,
      messageId,
      userId: this.userId
    });
  }
});
