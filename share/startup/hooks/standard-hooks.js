import { getAllStandardFileIds } from 'plio-util';
import { Standards, LessonsLearned, Discussions, Files } from '../../collections';
import { DiscussionService, StandardService } from '../../services';
import { DocumentTypes } from '../../constants';

Standards.after.insert((userId, { _id, organizationId }) => {
  DiscussionService.insert({
    organizationId,
    linkedTo: _id,
    documentType: DocumentTypes.STANDARD,
    isPrimary: true,
  });
});

Standards.after.remove((userId, doc) => {
  const { _id } = doc;
  const fileIds = getAllStandardFileIds(doc);

  LessonsLearned.remove({ documentId: _id });
  Discussions.find({ linkedTo: _id }, { fields: { _id: 1 } }).forEach((discussion) => {
    DiscussionService.remove({ _id: discussion._id });
  });
  Files.remove({ _id: { $in: fileIds } });

  StandardService.unlinkProblemDocs({ _id });
});
