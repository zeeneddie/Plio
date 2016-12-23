import Method, { CheckedMethod } from '../method';
import { ViewedBySchema } from '/imports/share/schemas/discussions-schema';
import DiscussionsService from './discussions-service';
import { idSchemaDoc } from '/imports/share/schemas/schemas';
import { inject, chain } from '../helpers';
import { Discussions } from '/imports/share/collections/discussions';
import { Organizations } from '/imports/share/collections/organizations';
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
