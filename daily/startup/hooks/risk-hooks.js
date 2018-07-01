import { Risks, Discussions, Files } from '../../collections';
import { DiscussionService, RiskService } from '../../services';
import { DocumentTypes } from '../../constants';

// WARN: userId may be undefined if used in another server

Risks.after.insert((userId, { _id, organizationId }) => {
  DiscussionService.insert({
    organizationId,
    documentType: DocumentTypes.RISK,
    linkedTo: _id,
    isPrimary: true,
  });
});

Risks.after.remove((userId, { _id, fileIds = [] }) => {
  Discussions.find({ linkedTo: _id }, { fields: { _id: 1 } }).forEach((discussion) => {
    DiscussionService.remove({ _id: discussion._id });
  });

  if (fileIds.length) Files.remove({ _id: { $in: fileIds } });

  RiskService.unlinkActions({ _id });
});
