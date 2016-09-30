import { ViewModel } from 'meteor/manuel:viewmodel';

import mixins from './mixins.js';
import vmTraverse from './vmTraverse.js';
import getChildrenData from './getChildrenData.js';

ViewModel.mixin({
  ...mixins,
  vmTraverse,
  getChildrenData
});
