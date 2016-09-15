import { ViewModel } from 'meteor/manuel:viewmodel';

import mixins from './mixins.js';
import workflow from './workflow.js';
import vmTraverse from './vmTraverse.js';
import getChildrenData from './getChildrenData.js';

ViewModel.mixin({
  ...mixins,
  workflow,
  vmTraverse,
  getChildrenData
});
