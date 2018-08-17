import { LessonsLearned } from '/imports/share/collections/lessons';

export const getLessonsCursorByDocumentId = ({ _id: documentId }) =>
  LessonsLearned.find({ documentId });
