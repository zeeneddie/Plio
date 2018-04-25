import { getAllNcFileIds } from 'plio-util';
import { NonConformities, Discussions, Files } from '../../collections';
import { NonConformityService, DiscussionService } from '../../services';
import { DocumentTypes } from '../../constants';

NonConformities.after.insert((userId, { _id, organizationId }) => {
  DiscussionService.insert({
    organizationId,
    documentType: DocumentTypes.NON_CONFORMITY,
    linkedTo: _id,
    isPrimary: true,
  });
});

NonConformities.after.remove((userId, doc) => {
  const { _id } = doc;
  const fileIds = getAllNcFileIds(doc);

  Discussions.find({ linkedTo: _id }, { fields: { _id: 1 } }).forEach((discussion) => {
    DiscussionService.remove({ _id: discussion._id });
  });

  if (fileIds.length) Files.remove({ _id: { $in: fileIds } });

  NonConformityService.unlinkActions({ _id });
});
