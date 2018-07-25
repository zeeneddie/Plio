import { loadUserById, loadFilesById, lenses } from 'plio-util';
import { view } from 'ramda';

const {
  owner,
  fileIds,
} = lenses;

export default {
  ImprovementPlan: {
    owner: loadUserById(view(owner)),
    files: loadFilesById(view(fileIds)),
  },
};
