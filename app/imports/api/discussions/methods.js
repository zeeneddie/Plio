import Method, { CheckedMethod } from '../method';
import { ViewedBySchema } from './discussions-schema';
import DiscussionsService from './discussions-service';
import { idSchemaDoc } from '../schemas';
import { inject, chain } from '../helpers';
import { Discussions } from './discussions';
import { Organizations } from '../organizations/organizations';
import {
  DSC_OnUpdateViewedByChecker,
  checkDocExistance,
  checkOrgMembership
} from '../checkers';

const injectDSC = inject(Discussions);

export const updateViewedByDiscussion = new CheckedMethod({
  name: 'Discussions.viewedBy.updateByDiscussion',

  validate: new SimpleSchema({
    _id: idSchemaDoc,
    messageId: idSchemaDoc
  }).validator(),

  check: checker => injectDSC(checker)(DSC_OnUpdateViewedByChecker),

  run({ _id, messageId }) {
    return DiscussionsService.updateViewedByDiscussion({
      _id,
      messageId,
      userId: this.userId
    });
  }
});

export const updateViewedByOrganization = new Method({
  name: 'Discussions.viewedBy.updateByOrganization',

  validate: new SimpleSchema({
    _id: idSchemaDoc
  }).validator(),

  check(checker) {
    return checker(({ _id }) => {
      return chain(
        checkDocExistance(Organizations, _id),
        checkOrgMembership(this.userId, _id)
      );
    })
  },

  run({ _id }) {
    return DiscussionsService.updateViewedByOrganization({
      _id,
      userId: this.userId
    });
  }
});
